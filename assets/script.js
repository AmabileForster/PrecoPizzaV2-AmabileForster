document.addEventListener("DOMContentLoaded", function(){
    //Pegar elementos do HTML
    const reportTable = document.querySelector("#report tbody");
    const pizzaForm = document.getElementById("pizzaForm");

    //Array de informações da pizza
    const pizzas = [];

    //Evento de formulario
    pizzaForm.addEventListener("submit", function (e) {
        e.preventDefault();

        //Obter valores do formulário
        const price = parseFloat(document.getElementById("pizzaPrice").value);
        const name = document.getElementById("pizzaName").value;
        const shape = document.getElementById("pizzaShape").value;
    
        let size;
        if (shape === "round") {
            size = parseInt(document.getElementById("pizzaSize").value);
        } else if (shape === "square") {
            size = parseInt(document.getElementById("pizzaSide").value);
        } else if (shape === "rectangle") {
            const width = parseInt(document.getElementById("pizzaWidth").value);
            const height = parseInt(document.getElementById("pizzaHeight").value);
            size = `${width}x${height}`;
        }

        //Valida os valores inseridos
        if (isPizzaValid(name, size, price, shape)) {
            const area = calculateArea(size, shape); 
            const priceArea = price / area;
    
            pizzas.push({ name, size, price, priceArea, shape });
            updateReport();
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    
        pizzaForm.reset();
    });

    // Ajusta a visibilidade dos campos de acordo com a forma selecionada
    document.getElementById("pizzaShape").addEventListener("change", function () {
        const squareFields = document.getElementById("squareFields");
        const rectangleFields = document.getElementById("rectangleFields");
        const sizeField = document.getElementById("sizeField");
    
        if (this.value === "square") {
            squareFields.style.display = "block";
            rectangleFields.style.display = "none";
            sizeField.style.display = "none";
        } else if (this.value === "rectangle") {
            squareFields.style.display = "none";
            rectangleFields.style.display = "block";
            sizeField.style.display = "none";
        } else {
            squareFields.style.display = "none";
            rectangleFields.style.display = "none";
            sizeField.style.display = "block";
        }
    });

    //Verifica se os valores da pizza são válidos
    function isPizzaValid(name, size, price, shape) {
        // Verifica se todos os campos estão preenchidos
        if (!name || !price || isNaN(price)) {
            alert("Preencha todos os campos corretamente!");
            return false;
        }
    
        // Verifica se já existe uma pizza com o mesmo tamanho e forma
        if (shape !== "rectangle" && pizzas.find(pizza => pizza.size === size && pizza.shape === shape)) {
            alert("Já existe uma pizza com esse tamanho e forma!");
            return false;
        } else if (shape === "rectangle") {
            const dimensions = size.split("x");
            const width = parseInt(dimensions[0]);
            const height = parseInt(dimensions[1]);
    
            // Verifica se já existe uma pizza com o mesmo tamanho e forma
            if (pizzas.find(pizza => pizza.size === `${width}x${height}` && pizza.shape === shape)) {
                alert("Já existe uma pizza com esse tamanho e forma!");
                return false;
            }
        }
    
        return true;
    }

    //Calcula a área da pizza com base no tamanho
    function calculateArea(size, shape) {
        if (shape === "round") {
            const radius = size / 2;
            return Math.PI * Math.pow(radius, 2);
        } else if (shape === "square") {
            return Math.pow(size, 2);
        } else if (shape === "rectangle") {
            const dimensions = size.split("x");
            return dimensions[0] * dimensions[1];
        }
    }

    //Atualiza a tabela de relatório com informações
    function updateReport() {
        pizzas.sort((a, b) => a.priceArea - b.priceArea);
        reportTable.innerHTML = "";

        //criar linha para cada pizza inserida
        pizzas.forEach((pizza, i) => {
            const row = reportTable.insertRow();
            row.innerHTML = `
                <td>${pizza.name}</td>
                <td>${pizza.size}</td>
                <td>R$${pizza.price.toFixed(2)}</td>
                <td>R$${pizza.priceArea.toFixed(2)}</td>
                <td>${i === 0 ? "Melhor Custo Beneficio" : `+${((pizza.priceArea - pizzas[0].priceArea) / pizzas[0].priceArea * 100).toFixed(0)}%`}</td>
            `
        })
    }
})