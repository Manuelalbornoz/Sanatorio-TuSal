import { ConfigService } from "@nestjs/config"
import type {TypeOrmModuleOptions} from "@nestjs/typeorm"

export const typeOrmConfig = (configService: ConfigService) : TypeOrmModuleOptions => ({
    type: 'mssql',
    host: configService.get('SQLServer_HOST'),
    port: +configService.get('SQLServer_PORT'),
    username: configService.get('SQLServer_USER'),
    password: configService.get('SQLServer_PASSWORD'),
    database: configService.get('SQLServer_DB'),
    options: {
        trustServerCertificate: configService.get<boolean>('SQLSerSQLServer_TRUST_CERTver_DB'),
        encrypt: false,
    },
    synchronize: false,
    autoLoadEntities: true,
})