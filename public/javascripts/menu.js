Vue.component("menu-list-dish", {
    props: {
        dish: {
            type: Object,
            required: true
        },

        index: {
            type: Number,
            required: true
        }
    },

    data: function () {
        return {
            isEditing: false,
            editCategory: '',
            editName: "",
            editPrice: "",
            editWeight: ""
        };
    },

    template: "#menu-list-dish-template",

    methods: {
        startEditItem: function () {
            this.isEditing = true;
            this.editCategory = this.dish.category;
            this.editName = this.dish.name;
            this.editPrice = this.dish.price;
            this.editWeight = this.dish.weight;
        },

        stopEditDish: function () {
            this.isEditing = false;
        },

        saveDish: function () {
            var listForm = $(this.$parent.$refs.dish);

            listForm.removeClass("was-validated");

            if (listForm[0][0].checkValidity() === false || this.editCategory.length === 0 ||
                listForm[0][1].checkValidity() === false || this.editName.length === 0 ||
                listForm[0][2].checkValidity() === false || this.editPrice.length === 0 ||
                listForm[0][3].checkValidity() === false || this.editWeight.length === 0) {
                    listForm.addClass("was-validated");
                    return;
            }

            this.isEditing = false;
            this.$emit("save-dish", this.dish, this.editCategory, this.editName, this.editPrice, this.editWeight);
        },
    }
});

Vue.component("menu-list", {
    data: function () {
        return {
            menu: [],
            category: "",
            name: "",
            price: "",
            weight: "",
            image: ""
        };
    },

    template: "#menu-list-template",

    created: async function () {
        await this.loadMenu();
    },

    methods: {
        loadMenu: async function () {
            var self = this;
            await axios.get('/api/getMenu')
                .then(function (response) {
                    self.menu = response.data
                })
                .catch(e => {
                    if (e.response) {
                        console.log(e.response.data)
                        console.log(e.response.status)
                        console.log(e.response.headers)
                    } else if (e.request) {
                        console.log(e.request)
                    } else {
                        console.log('Error', e.message)
                    }
                })
        },

        saveDish: async function (dish, editCategory, editName, editPrice, editWeight) {
            dish.category = editCategory;
            dish.name = editName;
            dish.price = editPrice;
            dish.weight = editWeight;

            await axios.post('/api/updateDish', dish)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    }
});

new Vue({
    el: "#menu"
});