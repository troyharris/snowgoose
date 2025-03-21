import { Persona } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class PersonaRepository extends BaseRepository {
  async findAll(): Promise<Persona[]> {
    try {
      console.log("Repository getting personas");
      return await this.prisma.persona.findMany({
        orderBy: {
          id: "asc",
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(id: number): Promise<Persona | null> {
    try {
      return await this.prisma.persona.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: { name: string; prompt: string }): Promise<Persona> {
    try {
      return await this.prisma.persona.create({
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    id: number,
    data: { name?: string; prompt?: string }
  ): Promise<Persona> {
    try {
      return await this.prisma.persona.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: number): Promise<Persona> {
    try {
      return await this.prisma.persona.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const personaRepository = new PersonaRepository();
