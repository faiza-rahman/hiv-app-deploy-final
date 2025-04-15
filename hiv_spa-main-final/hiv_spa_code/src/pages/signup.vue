<template class="white-background">
    <v-container class="white-background">
      <v-app-bar app color="#ffffff" elevation="0">
        <div class="d-flex align-center">
          <v-img contain height="200" width="200" src="@/assets/logo.png" />
          <h2></h2>
        </div>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-row>
        <v-col cols="5" md="5">
          <br />
          <v-img
            contain
            height="500"
            width="500"
            src="@/assets/female2.png"
            class="left-aligned"
          />
          <br /><br /><br /><br /><br />
          <v-card class="pa-2" elevation="0">
            <v-img class="my-3" contain height="350" />
          </v-card>
        </v-col>
        <v-col cols="1" sm="1" md="1"></v-col>
        <v-col cols="12" sm="6" md="6">
          <v-card elevation="0">
            <br /><br />
            <h1 class="login-title">Signup</h1>
            <br /><br />
            <v-text-field
              v-model="name"
              name="name"
              label="Name"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              rounded
              border-color="red"
            >
              <template v-slot:append>
                <v-icon color="white">mdi-check</v-icon>
              </template>
            </v-text-field>
            <v-text-field
              v-model="email"
              name="email"
              label="Email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              rounded
              border-color="red"
            >
              <template v-slot:append>
                <v-icon color="white">mdi-check</v-icon>
              </template>
            </v-text-field>
            <v-text-field
              v-model="password"
              name="password"
              label="Password"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              rounded
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
            ></v-text-field>
            <br />
            <div>
              <v-btn
                height="40"
                width="120"
                color="#D26E63"
                dark
                @click="signupUser"
              >
                <div class="button-text">Sign up</div>
              </v-btn>
            </div>
            <div>
              <br />
              <p class="inline-text">
                Already have an account?
                <router-link to="/login" class="sign-up-link"> Log in</router-link>
              </p>
            </div>
            <div v-if="error" class="error-text">{{ error }}</div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { signupUser } from '@/services/userService';
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        show1: false,
        error: null,
      };
    },
    methods: {
    async signupUser() {
      console.log("name:", this.name);
      console.log("email:", this.email);
      console.log("password:", this.password);
      try {
        const response = await signupUser(this.name, this.email, this.password);
        console.log("signup successful:", response);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error("Signup failed:", error);
      }
    },
  },
};
  </script>


  <!-- <script>
  try {
    // Validate input
    if (!this.name || !this.email || !this.password) {
      this.error = "All fields are required.";
      return;
    }

    // Make API call to backend using fetch
    const response = await fetch("http://localhost:3000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.name,
        email: this.email,
        password: this.password,
      }),
    });
    console.log("response", response);
    console.log("user", this.name, this.email, this.password);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred during signup.");
    }

    // Handle successful signup
    const responseData = await response.json();
    console.log("Signup successful:", responseData);
    alert("Signup successful! You can now log in.");
    this.$router.push("/login"); // Redirect to login page
  } catch (error) {
    // Handle errors
    console.error("Signup error:", error.message);
    this.error = error.message || "An error occurred during signup.";
  }
}
    },
  };
  </script> -->
  
  <style>
  .error-text {
    color: red;
  }
  .white-background {
    background-color: #ffffff;
  }
  .sign-up-text {
    color: #d26e63;
    font-weight: 600;
  }
  body,
  .v-container,
  .v-app-bar,
  .v-row,
  .v-col,
  .v-card,
  .v-btn,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  span {
    font-family: "Montserrat", sans-serif;
  }
  .inline-text {
    display: inline;
    font-weight: 600;
  }
  .login-title {
    font-size: 4em;
    font-weight: 600;
  }
  .sign-up-link {
    color: #d26e63;
    text-decoration: none;
    font-weight: 600;
  }
  .sign-up-link:hover {
    text-decoration: underline;
  }
  .button-text {
    font-size: large;
    text-transform: none;
    font-weight: 600;
  }
  </style>