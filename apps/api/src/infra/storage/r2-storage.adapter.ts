import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Inject, Injectable } from "@nestjs/common";

import { ENV, type Env } from "@/config/config.module.js";
import {
  type PresignDownloadInput,
  type PresignedUrl,
  type PresignUploadInput,
  type StoragePort,
} from "./storage.port.js";

/**
 * Adapter de storage para Cloudflare R2 via AWS SDK v3 (API S3).
 *
 * R2 é S3-compatível: trocar por B2/MinIO/S3 é só mudar endpoint/credenciais.
 * No dev local, aponta para MinIO (paridade dev↔prod, §8.5 do doc).
 */
@Injectable()
export class R2StorageAdapter implements StoragePort {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly defaultTtl: number;

  constructor(@Inject(ENV) env: Env) {
    this.bucket = env.STORAGE_BUCKET;
    this.defaultTtl = env.STORAGE_PRESIGN_TTL_SECONDS ?? 900;
    this.client = new S3Client({
      region: env.STORAGE_REGION ?? "auto",
      endpoint: env.STORAGE_ENDPOINT,
      // R2/MinIO exigem path-style addressing.
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.STORAGE_ACCESS_KEY_ID,
        secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
      },
    });
  }

  async presignUpload(input: PresignUploadInput): Promise<PresignedUrl> {
    const expiresIn = input.expiresInSeconds ?? this.defaultTtl;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: input.key,
      ContentType: input.contentType,
      // TODO: enforçar tamanho máximo via política de upload (POST policy) se
      // o app passar a usar presigned POST em vez de PUT.
    });

    const url = await getSignedUrl(this.client, command, { expiresIn });
    return {
      url,
      key: input.key,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
      requiredHeaders: { "Content-Type": input.contentType },
    };
  }

  async presignDownload(input: PresignDownloadInput): Promise<PresignedUrl> {
    const expiresIn = input.expiresInSeconds ?? this.defaultTtl;
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: input.key,
    });

    const url = await getSignedUrl(this.client, command, { expiresIn });
    return {
      url,
      key: input.key,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
    };
  }
}
