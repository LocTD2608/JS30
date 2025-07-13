const slides = document.querySelector('.carousel-slides');
const dotsContainer = document.querySelector('.carousel-dots');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.children.length;
let currentIndex = 0;

function updateCarousel() {
    slides.style.transform = `translateX(${-currentIndex * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function currentSlide(n) {
    currentIndex = n;
    updateCarousel();
}

document.querySelector('.prev-button').addEventListener('click', prevSlide);
document.querySelector('.next-button').addEventListener('click', nextSlide);

updateCarousel();

// Xử lý đăng nhập/đăng xuất
document.addEventListener("DOMContentLoaded", function() {
    const loginSection = document.getElementById("loginSection");
    const loginLink = document.getElementById("loginLink");
    const isLoggedIn = localStorage.getItem("LoggedIn") === "true";
    
    if (isLoggedIn) {
        loginSection.innerHTML = `<span>Xin Chào Bạn | <a href ="#" id = "logoutLink">Đăng xuất</a></span>`;
        const logoutLink = document.getElementById("logoutLink");
        logoutLink.addEventListener("click", function() {
            localStorage.removeItem("LoggedIn");
            window.location.href = "BTL.html";
        });
    } else {
        loginLink.href = "login.html";
    }
});

// Tìm kiếm sản phẩm
document.addEventListener("DOMContentLoaded", function() {
    const searchIcon = document.querySelector(".fa-search");
    const searchModal = document.getElementById("searchModal");
    const closeSearch = document.querySelector(".close-search");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const searchResults = document.getElementById("searchResults");

    // Mở modal tìm kiếm
    searchIcon.addEventListener("click", function() {
        searchModal.style.display = "block";
        searchInput.focus();
    });

    // Đóng modal tìm kiếm
    closeSearch.addEventListener("click", function() {
        searchModal.style.display = "none";
    });

    // Đóng khi click bên ngoài modal
    window.addEventListener("click", function(event) {
        if (event.target == searchModal) {
            searchModal.style.display = "none";
        }
    });

    // Xử lý tìm kiếm
    function performSearch() {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = "";

        if (query.length < 2) {
            searchResults.innerHTML = "<p>Vui lòng nhập ít nhất 2 ký tự</p>";
            return;
        }

        const products = document.querySelectorAll(".product");
        let foundResults = false;

        products.forEach(product => {
            const productName = product.querySelector("a").textContent.toLowerCase();
            const productPrice = product.querySelector("b").textContent.toLowerCase();

            if (productName.includes(query)) {
                foundResults = true;
                const resultItem = document.createElement("div");
                resultItem.className = "search-result-item";

                const productClone = product.cloneNode(true);
                productClone.style.width = "100%";
                productClone.style.padding = "10px";
                productClone.style.boxSizing = "border-box";

                resultItem.appendChild(productClone);
                searchResults.appendChild(resultItem);

                resultItem.addEventListener("click", function() {
                    const productLink = product.querySelector("a").href;
                    window.location.href = productLink;
                });
            }
        });

        if (!foundResults) {
            searchResults.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp</p>";
        }
    }

    searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            performSearch();
        }
    });
});

// Giỏ hàng
document.addEventListener("DOMContentLoaded", function() {
    const cartIcon = document.getElementById("cartIcon");
    const cartHoverBox = document.getElementById("cartHoverBox");
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutBtn = document.querySelector(".checkout-btn");

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let hideCartTimeout;

    // Hiển thị thông báo
    function showNotification(message) {
        const notification = document.createElement("div");
        notification.className = "cart-notification";
        notification.textContent = message;
        document.body.appendChild(notification);

        notification.style.display = "block";

        setTimeout(() => {
            notification.style.display = "none";
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Cập nhật giỏ hàng
    function updateCart() {
        cartItems.innerHTML = "";
        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.title}">
                <div class="cart-item-details">
                    <div>${item.title}</div>
                    <small>${item.quantity} × ${item.price.toLocaleString()} ₫</small>
                </div>
                <span class="cart-item-remove" data-index="${index}">&times;</span>
            `;
            cartItems.appendChild(itemElement);

            total += item.price * item.quantity;
            count += item.quantity;
        });

        // Thêm sự kiện click cho nút xóa
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
                showNotification("Đã xóa sản phẩm khỏi giỏ hàng");
            });
        });

        cartTotal.innerHTML = `Tổng số phụ: <b>${total.toLocaleString()} ₫</b>`;
        cartCount.textContent = count;

        // Hiển thị giỏ hàng trong 10s khi có thay đổi
        cartHoverBox.style.display = "block";
        clearTimeout(hideCartTimeout);
        hideCartTimeout = setTimeout(() => {
            cartHoverBox.style.display = "none";
        }, 10000);
    }

    // Xử lý thêm vào giỏ hàng
    document.querySelectorAll(".product button").forEach(button => {
        button.addEventListener("click", function() {
            const product = this.closest(".product");
            const title = product.querySelector("a").textContent.trim();
            const priceText = product.querySelector("b").textContent;
            const price = parseInt(priceText.replace(/[^\d]/g, "")) || 0;
            const imgSrc = product.querySelector("img").src;

            const existingItem = cart.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    title,
                    price,
                    imgSrc,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
            showNotification("Đã thêm sản phẩm vào giỏ hàng");
        });
    });

    // Hiển thị giỏ hàng khi hover
    cartIcon.addEventListener("mouseenter", () => {
        cartHoverBox.style.display = "block";
        clearTimeout(hideCartTimeout);
    });

    // Ẩn giỏ hàng khi rời chuột
    cartHoverBox.addEventListener("mouseleave", () => {
        hideCartTimeout = setTimeout(() => {
            cartHoverBox.style.display = "none";
        }, 300);
    });

    // Giữ hiển thị nếu chuột vào giỏ hàng
    cartHoverBox.addEventListener("mouseenter", () => {
        clearTimeout(hideCartTimeout);
    });

    // Xử lý nút thanh toán
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cart.length === 0) {
                showNotification("Giỏ hàng trống, vui lòng thêm sản phẩm");
                return;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = 'thanhtoan.html';
        });
    }

    // Cập nhật giỏ hàng khi trang được tải
    updateCart();
});