
//實體化
let delProductModal = null;
let productModal = null;

const App = {
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2',
      path: 'bella_vue',
      products:[],
      isNew: false,
      tempProduct:{
        imagesUrl: []
      }
    }
  },methods: {
    checkLogin() {
      // 確認是否登入
      axios.post(`${this.url}/api/user/check`)
        .then((res) => {
          this.getProductsData();
        })
        .catch((err) => {
          alert(err.data.message);
          //cookie不存在會導回登入頁面
          window.location = 'index.html';
        })
    }, 
    getProductsData() {
      axios.get(`${this.url}/api/${this.path}/admin/products`)
        .then((res) => {
          const { products } = res.data;
          this.products = products;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },       
    addProduct() {
      let addData = {data: this.tempProduct};
      axios.post(`${this.url}/api/${this.path}/admin/product`, addData)
      .then((res) => {
        alert(res.data.message);
        productModal.hide();
        this.getProductsData();
      })
      .catch((err) => {
        alert(err.data.message);
      })
    },
    editProduct() {
      let addData = {data: this.tempProduct};
      axios.put(`${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`, addData)
      .then((res) => {
        alert(res.data.message);
        productModal.hide();
        this.getProductsData();
      })
      .catch((err) => {
        alert(err.data.message);
      })
    },
    openModal(isNew, item) {
      if(isNew === 'add'){
        this.tempProduct = {
          imagesUrl: []
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === "edit") {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === "delete") {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
    removeProduct() {
      axios.delete(`${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`)
      .then((res) => {
        alert(res.data.message);
        delProductModal.hide();
        this.getProductsData();
      })
      .catch((err) => {
        alert(err.data.message);
        console.log(err);
      })
    }
  },
  mounted() {
    // 取得 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log('get Cookie token', token);
    axios.defaults.headers.common['Authorization'] = token;

    // 確認是否登入
    this.checkLogin();

    //bootstrap實體
    productModal = new bootstrap.Modal(document.getElementById('productModal')) //新增、編輯
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal')) //刪除
  }
}

Vue.createApp(App).mount("#app");