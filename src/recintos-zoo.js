class RecintosZoo {
    constructor() {
        this.Existentes = [
            {numero: 1, bioma: "savana", tamanho: 10, quantidade: 3, especie: "macaco"}, 
            {numero: 2, bioma: "floresta", tamanho: 5, quantidade: 0, especie: ""},
            {numero: 3, bioma: "savana e rio", tamanho: 7, quantidade: 1, especie: "gazela"},
            {numero: 4, bioma: "rio", tamanho: 8, quantidade: 0, especie: ""},
            {numero: 5, bioma: "savana", tamanho: 9, quantidade: 1, especie: "leao"}
        ];
        this.Possiveis = [
            {especie:"leao", tamanho:3, bioma:"savana"},
            {especie:"leopardo", tamanho:2, bioma:"savana"},
            {especie:"crocodilo", tamanho:3, bioma:"rio"},
            {especie:"macaco", tamanho:1, bioma:["floresta", "savana"]},
            {especie:"gazela", tamanho:2, bioma:"savana"},
            {especie:"hipopotamo", tamanho:4, bioma:["rio", "savana"]}
        ];
    }

    analisaRecintos(animal, quantidade) {
        let especie = animal.toLowerCase();
        const carnivoros = ["leao", "leopardo", "crocodilo"];
        
        const animalInfo = this.Possiveis.find(a => a.especie === especie);
        if (!animalInfo) {
            return {
                erro: "Animal inválido",
                recintosViaveis: null
            };
        }

        if (quantidade <= 0) {
            return {
                erro: "Quantidade inválida",
                recintosViaveis: null
            };
        }

        const recintosViaveis = this.Existentes.filter(recinto => {
            const biomaCompativel = Array.isArray(animalInfo.bioma) 
                ? animalInfo.bioma.some(b => recinto.bioma.includes(b))
                : recinto.bioma.includes(animalInfo.bioma);
            
            const animalExistente = this.Possiveis.find(a => a.especie === recinto.especie.toLowerCase());
            const espacoOcupadoAtual = recinto.quantidade * (animalExistente?.tamanho || 0);
            const espacoNecessario = quantidade * animalInfo.tamanho;
            const espacoSuficiente = recinto.tamanho - espacoOcupadoAtual >= espacoNecessario;
            
            const mesmaEspecie = recinto.especie.toLowerCase() === especie;
            const recintoVazio = recinto.quantidade === 0;

            if (carnivoros.includes(especie)) {
                return biomaCompativel && recintoVazio && espacoSuficiente;
            } else {
                return biomaCompativel && (mesmaEspecie || recintoVazio || (especie === "macaco" && !carnivoros.includes(recinto.especie.toLowerCase()))) && espacoSuficiente;
            }
        });

        if (recintosViaveis.length === 0) {
            return {
                erro: "Não há recinto viável",
                recintosViaveis: null
            };
        }

        return {
            erro: null,
            recintosViaveis: recintosViaveis.map(r => {
                const animalExistente = this.Possiveis.find(a => a.especie === r.especie.toLowerCase());
                const espacoOcupadoAtual = r.quantidade * (animalExistente?.tamanho || 0);
                const espacoOcupadoNovo = quantidade * animalInfo.tamanho;
                const espacoLivre = r.tamanho - espacoOcupadoAtual - espacoOcupadoNovo;
                return `Recinto ${r.numero} (espaço livre: ${espacoLivre} total: ${r.tamanho})`;
            })
        };
    }
}

export { RecintosZoo };
