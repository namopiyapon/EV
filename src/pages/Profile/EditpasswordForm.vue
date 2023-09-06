<template>
    <form @submit="onSuccess">
        <card>
            <template slot="header">
                <h5 class="title">Edit password</h5>
            </template>
            <div class="row">
                <div class="col-md-5 text-left">
                    <p v-if="user">email: {{ user.email }}</p>
                    <p v-else>Not logged in</p>
                </div>
            </div>

            <div class="row">
                <div class="col-md-5 text-left">
                    <base-input label="Password" type="Password" v-model="Password" placeholder="Password" required>
                    </base-input>
                </div>
            </div>
            <div class="row">
                <div class="col-md-5 text-left">
                    <base-input label="newPassword" type="Password" v-model="newPassword" placeholder="newPassword"
                        required>
                    </base-input>
                </div>
            </div>
            <template slot="footer">
                <button type="submit">Save</button> <br>
            </template>
        </card>
    </form>
</template>
<script>
import { Card, BaseInput } from "@/components/index";
import BaseButton from "@/components/BaseButton";
import { getAuth, updatePassword , onAuthStateChanged , signInWithEmailAndPassword,signOut} from "firebase/auth";
import { cookies } from "@/components/index";


export default {
    data() {
        return {
            email: "",
            Password: "",
            user: null,
            newPassword: "",
        };
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            this.user = user;
        });
    },

    methods: {
        async onSuccess(event) {
            event.preventDefault();
            this.changePassword();
        },

        async changePassword() {
            const auth = getAuth();
            // รับอีเมลและรหัสผ่านปัจจุบันของผู้ใช้
            const email = this.user.email; // เปลี่ยนเป็นอีเมลของผู้ใช้
            const currentPassword = this.Password; // เปลี่ยนเป็นรหัสผ่านปัจจุบันของผู้ใช้
            // รหัสผ่านใหม่ที่คุณต้องการตั้งค่า
            const newPassword = this.newPassword;
            console.log(email+"//"+currentPassword+"//"+newPassword);
            // ดึงอ็อบเจ็กต์ auth จาก Firebase
            try {
                // ล็อกอินผู้ใช้ด้วยอีเมลและรหัสผ่านปัจจุบัน
                await signInWithEmailAndPassword(auth, email, currentPassword);
                // หากล็อกอินสำเร็จ ให้เรียกใช้ฟังก์ชันอัปเดตรหัสผ่าน
                await updatePassword(auth.currentUser, newPassword);
                // ล็อกเอาท์ผู้ใช้หลังจากเปลี่ยนรหัสผ่านสำเร็จ
                await signOut(auth);
                alert("รหัสผ่านถูกเปลี่ยนและผู้ใช้ล็อกเอาท์แล้ว")
                console.log("รหัสผ่านถูกเปลี่ยนและผู้ใช้ล็อกเอาท์แล้ว");
                this.$router.push("/login")
            } catch (error) {
                alert("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน:"+ error.message)
                console.log("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน:"+ error.message);
            }
        }
    },
    components: {
        Card,
        BaseInput,
        BaseButton,
        cookies,
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
  