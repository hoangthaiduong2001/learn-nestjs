import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { GraphQLError } from 'graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      playground: true,
      sortSchema: true,
      formatError: (error: GraphQLError) => {
        const originalError = error.extensions?.originalError as any;
        console.log('error.originalError.err', error.extensions.originalError);
        if (originalError?.message && originalError?.statusCode) {
          return {
            message: originalError.errors[0].errors,
            errorOrigin: {
              field: originalError.errors[0].field,
              error: originalError.message || 'Bad Request',
              statusCode: originalError.statusCode,
            },
          };
        }

        return {
          message: error.message,
          errorOrigin: {
            error: 'Internal Server Error',
            statusCode: 500,
          },
        };
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
