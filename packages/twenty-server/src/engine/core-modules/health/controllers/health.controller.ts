import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { existsSync } from 'fs';

import { HealthIndicatorId } from 'src/engine/core-modules/health/enums/health-indicator-id.enum';
import { AppHealthIndicator } from 'src/engine/core-modules/health/indicators/app.health';
import { ConnectedAccountHealth } from 'src/engine/core-modules/health/indicators/connected-account.health';
import { DatabaseHealthIndicator } from 'src/engine/core-modules/health/indicators/database.health';
import { RedisHealthIndicator } from 'src/engine/core-modules/health/indicators/redis.health';
import { WorkerHealthIndicator } from 'src/engine/core-modules/health/indicators/worker.health';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';

@Controller('healthz')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly databaseHealth: DatabaseHealthIndicator,
    private readonly redisHealth: RedisHealthIndicator,
    private readonly workerHealth: WorkerHealthIndicator,
    private readonly connectedAccountHealth: ConnectedAccountHealth,
    private readonly appHealth: AppHealthIndicator,
  ) {}

  @Get()
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  @HealthCheck()
  check() {
    // Check if migrations are still in progress
    if (this.areMigrationsInProgress()) {
      throw new ServiceUnavailableException('Migrations in progress');
    }

    return this.health.check([]);
  }

  /**
   * Check if database migrations are currently running.
   * The entrypoint script creates /tmp/migrations.lock before migrations
   * and removes it after completion.
   */
  private areMigrationsInProgress(): boolean {
    return existsSync('/tmp/migrations.lock');
  }

  @Get(':indicatorId')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  @HealthCheck()
  checkService(@Param('indicatorId') indicatorId: HealthIndicatorId) {
    const checks = {
      [HealthIndicatorId.database]: () => this.databaseHealth.isHealthy(),
      [HealthIndicatorId.redis]: () => this.redisHealth.isHealthy(),
      [HealthIndicatorId.worker]: () => this.workerHealth.isHealthy(),
      [HealthIndicatorId.connectedAccount]: () =>
        this.connectedAccountHealth.isHealthy(),
      [HealthIndicatorId.app]: () => this.appHealth.isHealthy(),
    };

    if (!(indicatorId in checks)) {
      throw new BadRequestException(`Invalid indicatorId: ${indicatorId}`);
    }

    return this.health.check([checks[indicatorId]]);
  }
}
