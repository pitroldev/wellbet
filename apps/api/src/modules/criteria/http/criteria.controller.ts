import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "@/shared/guards/auth.guard.js";
import { Roles, RolesGuard } from "@/shared/guards/roles.guard.js";
import { CreateCriterionUseCase } from "@/modules/criteria/application/create-criterion.use-case.js";
import { ListCriteriaUseCase } from "@/modules/criteria/application/list-criteria.use-case.js";
import { UpdateCriterionUseCase } from "@/modules/criteria/application/update-criterion.use-case.js";
import type { Criterion } from "@/modules/criteria/application/criteria.repository.port.js";
import {
  CreateCriterionDto,
  CriterionResponseDto,
  ListCriteriaQueryDto,
  UpdateCriterionDto,
} from "./criteria.dto.js";

/**
 * Critérios de aprovação configuráveis (checklist da revisão — §5).
 *
 *  GET   /criteria            — lista (config do console; `?enabledOnly=true` p/ o checklist).
 *  POST  /criteria            — cria um novo critério.
 *  PATCH /criteria/:id        — edita rótulo/ajuda/ordem ou habilita/desabilita.
 *
 * Restrito a `reviewer`/`admin` (RolesGuard) — a equipe de revisão gerencia.
 */
@ApiTags("criteria")
@Controller("criteria")
@UseGuards(AuthGuard, RolesGuard)
@Roles("reviewer", "admin")
export class CriteriaController {
  constructor(
    private readonly listCriteria: ListCriteriaUseCase,
    private readonly createCriterion: CreateCriterionUseCase,
    private readonly updateCriterion: UpdateCriterionUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: "Lista os critérios de aprovação." })
  @ApiOkResponse({ type: [CriterionResponseDto] })
  async list(@Query() query: ListCriteriaQueryDto): Promise<CriterionResponseDto[]> {
    const items = await this.listCriteria.execute({ enabledOnly: query.enabledOnly });
    return items.map(toResponse);
  }

  @Post()
  @ApiOperation({ summary: "Cria um critério de aprovação." })
  @ApiOkResponse({ type: CriterionResponseDto })
  async create(@Body() dto: CreateCriterionDto): Promise<CriterionResponseDto> {
    const created = await this.createCriterion.execute({
      key: dto.key,
      label: dto.label,
      description: dto.description,
      failHint: dto.failHint,
      enabled: dto.enabled,
      sortOrder: dto.sortOrder,
    });
    return toResponse(created);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Edita ou habilita/desabilita um critério." })
  @ApiOkResponse({ type: CriterionResponseDto })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCriterionDto,
  ): Promise<CriterionResponseDto> {
    const updated = await this.updateCriterion.execute(id, {
      label: dto.label,
      description: dto.description,
      failHint: dto.failHint,
      enabled: dto.enabled,
      sortOrder: dto.sortOrder,
    });
    return toResponse(updated);
  }
}

function toResponse(c: Criterion): CriterionResponseDto {
  return {
    id: c.id,
    key: c.key,
    label: c.label,
    description: c.description,
    failHint: c.failHint,
    enabled: c.enabled,
    sortOrder: c.sortOrder,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}
