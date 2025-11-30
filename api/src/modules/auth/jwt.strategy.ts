import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

// Define el tipo de dato que se espera dentro del token (el "payload")
interface JwtPayload {
  userId: string; // El ID en el payload del token (que coincide con user.id)
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'YOUR_SUPER_SECRET_KEY',
    });
  }

  // Este método se llama después de que el token es extraído y verificado
  async validate(payload: JwtPayload) {
    // Busca el usuario en la base de datos
    const user = await this.usersService.findOne(payload.userId);
    
    if (!user) {
        return null;
    }
    
    // 🔑 CORRECCIÓN CRÍTICA: Mapear user.id a userId y devolver solo lo necesario
    return { 
        // Mapea el ID de la BD (user.id) al nombre esperado en el controlador (userId)
        userId: user.id, 
        // Incluye el rol para la comprobación de seguridad
        role: user.role, 
        // Opcional: puedes incluir el email si lo necesitas en el req
        email: user.email 
    }; 
  }
}