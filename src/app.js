document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      {
        id: 1,
        name: "Law Breakers",
        img: "1.jpg",
        price: 20000,
        description: "1. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ullam similique soluta rerum ab odit, quasi quis, sed animi, error ut ipsam veniam ex perspiciatis dolorum mollitia nam quidem. Nulla.",
      },
      {
        id: 2,
        name: "Explorer Bean",
        img: "2.jpg",
        price: 25000,
        description: "2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ullam similique soluta rerum ab odit, quasi quis, sed animi, error ut ipsam veniam ex perspiciatis dolorum mollitia nam quidem. Nulla.",
      },
      {
        id: 3,
        name: "Fine Coffee",
        img: "3.jpg",
        price: 30000,
        description: "3. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ullam similique soluta rerum ab odit, quasi quis, sed animi, error ut ipsam veniam ex perspiciatis dolorum mollitia nam quidem. Nulla.",
      },
      {
        id: 4,
        name: "Vietnamese Coffee",
        img: "4.jpg",
        price: 35000,
        description: "4. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ullam similique soluta rerum ab odit, quasi quis, sed animi, error ut ipsam veniam ex perspiciatis dolorum mollitia nam quidem. Nulla.",
      },
      {
        id: 5,
        name: "Light Coffee",
        img: "5.jpg",
        price: 40000,
        description: "5. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ullam similique soluta rerum ab odit, quasi quis, sed animi, error ut ipsam veniam ex perspiciatis dolorum mollitia nam quidem. Nulla.",
      },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,

    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // Jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({
          ...newItem,
          quantity: 1,
          total: newItem.price,
        });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // Jika barang sudah ada, cek apakah barang beda atau sama dengan yg ada di cart
        this.items = this.items.map((item) => {
          // Jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // Jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    remove(id) {
      // ambil item yang mau diremove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 per 1
        this.items = this.items.map((item) => {
          // jika bukan barang yg di click
          if (item.id !== id) {
            return item;
          } else {
            // jika bener
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barang sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutBtn = document.querySelector(".checkout-button");
checkoutBtn.disabled = true;

const form = document.querySelector("#checkoutForm");
form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutBtn.classList.remove("disabled");
      checkoutBtn.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutBtn.disabled = false;
  checkoutBtn.classList.remove("disabled");
});

// Kirim data ketika tombol checkout di klik
checkoutBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  console.log(objData);
  const message = formatMessage(objData);
  window.open("http://wa.me/6285721122232?text=" + encodeURIComponent(message));
});

// Format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
    Nama : ${obj.name}
    Email : ${obj.email}
    No Hp : ${obj.phone}
  Data Pesanan
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)})\n`)}
  Total : ${rupiah(obj.total)}
  Terima kasih.
  `;
};
// Konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
