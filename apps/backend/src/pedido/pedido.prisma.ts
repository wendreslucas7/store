import { Pedido } from '@gstore/core';
import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'src/db/prisma.provider';

@Injectable()
export class PedidoPrisma {
  constructor(private readonly prisma: PrismaProvider) {}

  async obterPedidos(): Promise<Pedido[]> {
    const pedidos = await this.prisma.pedido.findMany({
      include: {
        itens: false,
        entrega: false,
      },
    });
    return pedidos as any;
  }

  async obterPorId(id: number): Promise<Pedido | null> {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: {
          include: { produto: { select: { id: true, nome: true } } },
        },
        entrega: true,
      },
    });
    return pedido as any;
  }

  async salvar(pedido: Pedido): Promise<void> {
    await this.prisma.pedido.create({
      data: {
        data: pedido.data,
        status: pedido.status,
        valorTotal: pedido.valorTotal,
        formaPagamento: pedido.formaPagamento,
        entrega: { create: { ...pedido.entrega } },
        itens: {
          create: pedido.itens.map((item) => ({
            produtoId: item.produto.id,
            precoUnitario: item.precoUnitario,
            quantidade: item.quantidade,
          })),
        },
      },
    });
  }

  async excluir(id: number): Promise<void> {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });
    if (!pedido) return;

    await this.prisma.$transaction([
      this.prisma.itemPedido.deleteMany({ where: { pedidoId: id } }),
      this.prisma.pedido.delete({ where: { id } }),
      this.prisma.pedidoEntrega.delete({ where: { id: pedido.entregaId } }),
    ]);
  }
}
