import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service'; // Asegúrate de que esta ruta sea correcta

// Define el tipo de dato que se espera dentro del token (el "payload")
interface JwtPayload {
  userId: string; // o string, dependiendo de tu ID de usuario
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    super({
      // Extrae el JWT del encabezado 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Desactiva la verificación automática de expiración (generalmente se usa false)
      ignoreExpiration: false,
      // La clave secreta para verificar la firma del token (DEBE coincidir con la de tu login)
      secretOrKey: process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY', // <-- ¡IMPORTANTE! Usa la clave de tu .env
    });
  }

  // Este método se llama después de que el token es extraído y verificado
  async validate(payload: JwtPayload) {
    // Busca el usuario en la base de datos (para asegurar que existe)s
    const user = await this.usersService.findOne(payload.userId);
    
    if (!user) {
        // Podrías lanzar un error de no autorizado aquí
        return null;
    }
    
    // Retorna el objeto de usuario, que NestJS adjuntará a req.user
    // Asegúrate de excluir la contraseña antes de devolver el objeto!
    const { password, ...result } = user;
    return result; 
  }
}