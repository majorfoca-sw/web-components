export default {
  canonical: {
    __groups__: {},
    __info__: {},
    __model__: {},
    __validation__: {},
  },
  demo: {
    __groups__: {
      1: ['single_string_field_twoandhalf'],
      single_group: [
        'single_number_field_one',
        'single_string_field_two',
        'single_model_field_six',
        'single_file_field_six',
      ],
      newbbdd_group: [
        'newbbdd_number_field_seven',
        'newbbdd_string_field_eight',
        'single_textarea_field_four',
        'newbbdd_model_field_eightandhalf',
      ],
      multiple_group: [
        'multiple_number_field_nine',
        'multiple_string_field_ten',
        'multiple_radio_field_eleven',
        'multiple_textarea_field_twelwe',
        'multiple_model_field_thirteen',
      ],
    },
    __info__: {
      single_number_field_one: 'info about single_number field one',
      single_string_field_two: 'info about single_string field two',
      single_radio_field_three_withoutgroup:
        'info about single_radio field three',
      single_textarea_field_four: 'info about single_textarea field four',
      single_model_field_six: 'info about single_model field six',
      single_file_field_six: 'extension allowed: pdf,zip,jpg,png',
      newbbdd_number_field_seven: 'info about newbbdd_number field seven',
      newbbdd_string_field_eight: 'info about newbbdd_string field eight',
      multiple_number_field_nine: 'info about multiple_number field nine',
      multiple_string_field_ten: 'info about multiple_string field ten',
      multiple_radio_field_eleven: 'info about multiple_radio field eleven',
      multiple_textarea_field_twelwe:
        'info about multiple_textarea field twelwe',
      multiple_model_field_thirteen: 'info about multiple_model field thirteen',
    },
    __model__: {
      single_number_field_one: 'single_number',
      single_string_field_two: 'single_string',
      single_string_field_twoandhalf: 'single_string',
      single_radio_field_three_withoutgroup: 'single_radio',
      single_textarea_field_four: 'single_textarea',
      single_file_field_six: 'single_file',
      single_checkbox_field_five_withoutgroup_neitherinfo: 'single_checkbox',
      single_model_field_six: 'single_model',
      newbbdd_number_field_seven: 'newbbdd_number',
      newbbdd_string_field_eight: 'newbbdd_string',
      newbbdd_model_field_eightandhalf: 'newbbdd_model',
      multiple_number_field_nine: 'multiple_number',
      multiple_string_field_ten: 'multiple_string',
      multiple_radio_field_eleven: 'multiple_radio',
      multiple_textarea_field_twelwe: 'multiple_textarea',
      multiple_model_field_thirteen: 'multiple_model',
    },
    __validation__: {
      single_number_field_one: {
        maxlength: 2,
        required: true,
        tovalidate: 'number',
      },
      single_string_field_two: {
        required: true,
        tovalidate: 'alpha',
      },
      single_radio_field_three_withoutgroup: {
        required: true,
      },
      single_textarea_field_four: {
        required: true,
        tovalidate: 'alpha',
      },
      single_file_field_six: {
        required: true,
        tovalidate: 'file:pdf,zip,jpg,png',
      },
      newbbdd_number_field_seven: {
        maxlength: 5,
        required: true,
        tovalidate: 'number',
      },
      newbbdd_string_field_eight: {
        required: true,
        tovalidate: 'alpha',
      },
      multiple_number_field_nine: {
        maxlength: 2,
        required: true,
        tovalidate: 'number',
      },
      multiple_string_field_ten: {
        required: true,
        tovalidate: 'alpha',
      },
      multiple_radio_field_eleven: {
        required: true,
      },
      multiple_textarea_field_twelwe: {
        required: true,
        tovalidate: 'alpha',
      },
    },
  },
  single_model_field_six: {
    __groups__: {},
    __info__: {},
    __model__: {
      submodel_single_string_field: 'single_string',
      submodel_single_textarea_field: 'single_textarea',
    },
    __validation__: {},
  },
  newbbdd_model_field_eightandhalf: [
    'value one',
    'value two',
    'value three',
    'value four',
    'value five',
    'value six',
  ],
  single_radio_field_three_withoutgroup: [
    'radio value one',
    'radio value two',
    'radio value three',
    'radio value four',
    'radio value five',
    'radio value six',
  ],
  multiple_model_field_thirteen: {
    __groups__: {},
    __info__: {},
    __model__: {
      submodel_multiple_number_field: 'multiple_number',
      submodel_multiple_string_field: 'multiple_string',
      submodel_multiple_textarea_field: 'multiple_textarea',
    },
    __validation__: {},
  },
};
