export function capitalizarNome(nome: string): string {
    return nome
      ?.toLowerCase()
      .split(' ')
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ');
  }

export function  formatarRg(rg: string): string {
    const num = rg.replace(/\D/g, '');
    return num.length === 9
      ? num.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4')
      : rg;
  }