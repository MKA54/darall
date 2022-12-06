new Vue({
    el: '#dish',
    data: {
        category: '',
        name: '',
        price: '',
        weight: '',
        file: ''
    },

    methods: {
        handleFileUpload: async function () {
            this.file = this.$refs.file.files[0];
        },

        addDish: async function () {
            var inputForm = $(this.$refs.inputForm);

            if (!this.validation(inputForm)) {
                return;
            }

            var formData = new FormData();
            formData.append('category', this.category);
            formData.append('name', this.name);
            formData.append('price', this.price);
            formData.append('weight', this.weight);
            formData.append('file', this.file);

            await axios.post(
                '/api/createDish',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });

            location.reload();
        },

        validation: function (inputForm) {
            inputForm.removeClass('was-validated');

            if (inputForm[0][0].checkValidity() === false || this.category.length === 0) {
                inputForm.addClass("was-validated");
                return false;
            }

            if (inputForm[0][1].checkValidity() === false || this.name.length === 0) {
                inputForm.addClass("was-validated");
                return false;
            }

            var errorPrice = $(this.$refs.errorPrice)
            if (inputForm[0][2].checkValidity() === false) {
                inputForm.addClass('was-validated');

                if (this.price.length === 0) {
                    errorPrice.text('Введите цену.');
                    return false;
                }

                errorPrice.text('Цена указана некорректно.');
                return false;
            }

            var errorWeight = $(this.$refs.errorWeight)
            if (inputForm[0][3].checkValidity() === false) {
                inputForm.addClass('was-validated');

                if (this.weight.length === 0) {
                    errorWeight.text('Введите вес блюда.');
                    return false;
                }

                errorWeight.text('Вес указан некорректно.');
                return false;
            }

            if (this.file === '') {
                inputForm.addClass('was-validated');
                return false;
            }

            return true;
        }
    }
})