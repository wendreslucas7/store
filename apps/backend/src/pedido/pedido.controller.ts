import { Pedido } from '@gstore/core';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PedidoPrisma } from './pedido.prisma';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly repo: PedidoPrisma) {}

  @Get()
  async obterPedidos() {
    return this.repo.obterPedidos();
  }

  @Get(':id')
  async obterPorId(@Param('id') id: string) {
    return this.repo.obterPorId(+id);
  }

  @Post()
  async salvar(@Body() pedido: Pedido) {
    await this.repo.salvar(pedido);
  }

  @Delete(':id')
  async excluir(@Param('id') id: string) {
    await this.repo.excluir(+id);
  }
}
