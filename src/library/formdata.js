const MyFormData = {
    install(app) {
        app.config.globalProperties.$formdata = {
            generate(data) {
                const form = new FormData();
                for (let key in data) {
                    form.append(key, data[key]);
                }
                return form;
            }
        };
    }
};

export default MyFormData;
