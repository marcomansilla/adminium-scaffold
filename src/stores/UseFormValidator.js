import { defineStore } from 'pinia';

export const useFormValidatorStore = defineStore('formValidator', {
    state: () => ({
        form_errors: {},
    }),

    getters: {
      formErrors: (state) => state.form_errors,
    },

    actions: {
      initializeFormValidator(formname) {
        this.form_errors[formname] = {
          errors: {},
          errors_data: {
            count: 0,
            fields: [],
          }
        }
      },
      checkFormErrors(formname, fields, rules) {
        Object.keys(rules).forEach((field) => {
            const fieldRules = rules[field];
            const value = fields[field];

            for (const rule of fieldRules) {
              const error = rule(value, fields);
              if (error) {
                this.form_errors[formname].errors[field] = error;
                this.form_errors[formname].errors_data.fields.push(field);
                this.form_errors[formname].errors_data.fields = [...new Set(this.form_errors[formname].errors_data.fields)];
              }
            }
            this.countErrors(formname);
        });
      },
      clearFormError(formname, field) {
        delete this.form_errors[formname].errors[field];
        let index = this.form_errors[formname].errors_data.fields.findIndex((el) => el == field);
        if (index >= 0) {
          this.form_errors[formname].errors_data.fields.splice(index, 1);
          this.countErrors(formname);
        }
      },
      injectError(formname, field, text) {
        this.form_errors[formname].errors[field] = text;
        this.form_errors[formname].errors_data.fields.push(field);
        this.form_errors[formname].errors_data.fields = [...new Set(this.form_errors[formname].errors_data.fields)];
        this.countErrors(formname);
      },
      countErrors(formname) {
        this.form_errors[formname].errors_data.count = this.form_errors[formname].errors_data.fields.length;
      },
      clearAllFormErrors(formname) {
        this.initializeFormValidator(formname)
      }
    },
});
