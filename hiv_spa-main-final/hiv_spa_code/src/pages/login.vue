<template class="white-background">
  <v-container class="white-background">
    <v-app-bar
        app
        color="#ffffff"
        elevation=0
      >
        <div class="d-flex align-center">
          <v-img
            contain
            height="200"
            width="200"
            src="@/assets/logo.png"
          />
          <h2></h2>
        </div>
        <v-spacer></v-spacer>
      </v-app-bar>
    <v-row>
      <v-col
        cols="5"
        md="5"
      >
      <br>
      <v-img
            contain
            height="500"
            width="500"
            src="@/assets/female2.png"
            class="left-aligned"
          />
      <br><br><br><br><br>
        <v-card
          class="pa-2"
          elevation=0
        >
          <v-img
           class="my-3"
           contain
           height="350"
         />
        </v-card>
      </v-col>
      <v-col
        cols="1"
        sm="1"
        md="1"
      ></v-col>
      <v-col
        cols="12"
        sm="6"
        md="6"
      >
        <v-card
          elevation="0"
        >
        <br><br>
        <h1 class="login-title">Login</h1> <br><br>
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
          <br>
          <div>
            <v-btn
              height="40"
              width="120"
              color="#D26E63"
              dark
              @click="handleLogin"
            >
              <div class="button-text">Log in</div>
            </v-btn>
          </div>
          <div >
            <br>
            <p class="inline-text">Don't have an account?  
              <router-link to="/signup" class="sign-up-link"> Sign up</router-link>
            </p>
        </div>
        <!-- <div v-if="error" class="error-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ error }}</div> -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="js">
import { loginUser } from '@/services/userService';

export default {
  data() {
    return {
      email: '',
      password: '',
      show1: false,
      error: null,
    };
  },
  methods: {
    async handleLogin() {
      console.log("email:", this.email);
      console.log("password:", this.password);
      try {
        
        const response = await loginUser(this.email, this.password);
        console.log("Login successful:", response);
        console.log("User ID:", response._id);
        // get first name from response
        const firstName = response.name.split(' ')[0];
        console.log("First Name:", firstName);
        console.log("User Name:", response.name);
        localStorage.setItem('userId', response._id);
        localStorage.setItem('userName', firstName);
        console.log("User ID stored in localStorage:", localStorage.getItem('userId'));
        this.$router.push('/dashboard');
      } catch (error) {
        console.error("Login failed:", error);
        this.error = 'Incorrect email or password. Please try again.';
      }
    },
  },
};

</script>

  <!-- // export default {
  //   data () {
  //     return {
  //       show1: false,
  //       show2: true,
  //       password: 'Password',
  //       rules: {
  //         required: value => !!value || 'Required.',
  //         min: v => v.length >= 8 || 'Min 8 characters',
  //         emailMatch: () => (`The email and password you entered don't match`),
  //       },
  //     }
  //   },
  // } -->


<!-- 
<script>
import axios from "axios";
import bcryptjs from 'bcryptjs';

export default {
  data() {
    return {
      email: '',
      password: '',
      show: false,
      loginSuccess: false,
      post: null,
      error: null,
    };
  },

  methods: {
    goToAdminLogin() {
      this.$router.push({ name: 'AdminLogin' });
    },
    async getUserEmail(email, password) {
      return new Promise(async (resolve, reject) => {

        try {
          const response = await axios.get(`http://localhost:3000/users/email/${email}`);
          
          if (response.data && response.data.length > 0) {
            const hashedPassword = response.data[0].password;
            const type = response.data[0].type;

            if (type === "instructor") {
              bcryptjs.compare(password, hashedPassword).then(result => {
                if (result) {
                  console.log("SUCCESS");
                  resolve(response.data[0].name); // Resolve the instructor name
                } else {
                  console.log("FAILURE");
                  resolve(false);
                }
              });
            } else {
              console.log("FAILURE");
              reject("Must be an instructor to log in.");
            }
          } else {
            console.log("FAILURE");
            reject("User not found");
          }
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },

    async userLogin() {
      try {
        let email = this.email?.trim();
        let password = this.password?.trim();

        const instructorName = await this.getUserEmail(email, password);

        if (instructorName) {
          localStorage.setItem('instructorName', instructorName); // Corrected line
          console.log("LOCAL STORAGE:", localStorage.getItem("instructorName"));
          console.log("instructorName: ", instructorName)
          this.$router.push({ name: 'Dashboard', params: { instructorName } });
        }
        // If instructorName is not retrieved, set the error message
        if (!instructorName) {
          this.error = 'Incorrect email or password. Please try again.';
        }
      } catch (error) {
        console.error('Error:', error);
        this.error = 'Incorrect email or password. Please try again.';
      }
    }
  }
};
</script> -->

<style>
.error-text {
  color: red; /* Define your red color */
}
.white-background {
  background-color: #ffffff;
}
.sign-up-text {
  color: #D26E63;
  font-weight: 600;
}
body, .v-container, .v-app-bar, .v-row, .v-col, .v-card, .v-btn, h1, h2, h3, h4, h5, h6, p, span {
  font-family: 'Montserrat', sans-serif;
}
.inline-text {
  display: inline;
  font-weight: 600;
}
.login-title {
  font-size: 4em; /* Adjust the size as needed */
  font-weight: 600;
}
.login-btn {
  height: 56px; /* Adjust the height as needed */
  font-size: 1.5em; /* Adjust the font size as needed */
}
.sign-up-link {
  color: #D26E63;
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
.outlined-black .v-input__control .v-input__slot::before {
  border-color: black !important;
}
.v-text-field--outlined fieldset {
    color: black !important
}
.left-aligned {
  display: block;
  margin-left: -100;
}
</style>