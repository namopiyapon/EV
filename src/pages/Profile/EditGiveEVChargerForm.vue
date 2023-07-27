<template>
  <card >
    <template slot="header">
      <h5 class="title">Give EV Charger</h5>
    </template>
    <div class="row">
      <div class="col-md-12 text-left">
        <base-input
          label="name pump"
          placeholder="name pump"
          v-model="model.namepump"
        >
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12 text-left">
        <base-input
          label="location"
          v-model="model.location"
          placeholder="location"
        >
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4 pr-md-1 text-left">
        <base-input label="type" v-model="model.type" placeholder="type">
        </base-input>
      </div>
      <div class="col-md-4 px-md-1 text-left">
        <base-input
          label="amount"
          v-model="model.amount"
          placeholder="amount"
        >
        </base-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 text-left">
        <base-input>
          <label>Details</label>
          <textarea
            rows="4"
            cols="80"
            class="form-control"
            placeholder="Here can be your description"
            v-model="model.about"
          >
          </textarea>
        </base-input>
      </div>
    </div>
    <template slot="footer">
      <base-button type="success" fill>Save</base-button>
    </template>
  </card>
</template>
<script>
import { Card, BaseInput } from "@/components/index";

import BaseButton from "@/components/BaseButton";

export default {
  components: {
    Card,
    BaseInput,
    BaseButton,
  },
  props: {
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>
<style></style>
