
export interface Avaliacao {
  key?: string,
  setor: string,
  nivelPretendido: string,
  nivelAtingido?: string,
  dataInicio: string,
  dataInicioAvaliacaoComplementar?: string,
  dataFimAvaliacaoComplementar?: string,
  dataFim?: string,
  corpo: any
}
