document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Função para adicionar item ao carrinho
    function addToCart(name, price) {
        const item = cart.find(product => product.name === name);
        if (item) {
            item.quantity++;
        } else {
            cart.push({ name, price: parseFloat(price), quantity: 1 });
        }
        updateCartUI();
        saveCart();
    }

    // Função para remover item do carrinho
    function removeFromCart(name) {
        cart = cart.filter(product => product.name !== name);
        updateCartUI();
        saveCart();
    }

    // Função para atualizar a quantidade de itens no carrinho
    function updateQuantity(name, quantity) {
        const item = cart.find(product => product.name === name);
        if (item) {
            item.quantity += quantity;
            if (item.quantity <= 0) {
                removeFromCart(name);
            }
        }
        updateCartUI();
        saveCart();
    }

    // Função para atualizar a interface do carrinho
    function updateCartUI() {
        const cartContainer = document.querySelector("#cart");
        cartContainer.innerHTML = "";
        cart.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                
                <p>Produto adicionado: ${item.name}</p>
                <button class="remove" data-name="${item.name}">Limpar carinho</button>
            `;
            //tentando
            //<p>Produto: ${item.name}</p>
            //<p>Quantidade: ${item.quantity}</p>

            cartContainer.appendChild(itemElement);
        });
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalElement = document.createElement("p");
        //totalElement.textContent = `Total: ${total.toFixed(2)} R$`;
        cartContainer.appendChild(totalElement);
        cartContainer.style.display = cart.length > 0 ? "block" : "none";
        
        // Mostrar botão "Finalizar Compra" se houver itens no carrinho
        const checkoutBtn = document.querySelector('.checkout-btn');
        checkoutBtn.style.display = cart.length > 0 ? "block" : "none";
    }

    // Função para salvar o carrinho no localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Eventos para os botões de adicionar ao carrinho
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", event => {
            const name = event.target.getAttribute("data-name");
            const price = event.target.getAttribute("data-price");
            addToCart(name, price);
        });
    });

    // Eventos para os botões de aumentar, diminuir e remover item do carrinho
    document.querySelector("#cart").addEventListener("click", event => {
        if (event.target.classList.contains("increase")) {
            const name = event.target.getAttribute("data-name");
            updateQuantity(name, 1);
        }
        if (event.target.classList.contains("decrease")) {
            const name = event.target.getAttribute("data-name");
            updateQuantity(name, -1);
        }
        if (event.target.classList.contains("remove")) {
            const name = event.target.getAttribute("data-name");
            removeFromCart(name);
        }
    });

    // Evento para redirecionar para a página de checkout
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener("click", () => {
        // Preparar os dados para enviar para a página de checkout
        const checkoutData = {
            cart: cart
        };
        // Armazenar temporariamente os dados no sessionStorage
        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        // Redirecionar para a página de checkout
        window.location.href = '../pages/checkout.html';
    });

    // Inicializa a UI do carrinho
    updateCartUI();
});
