import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./stores/auth";
import { showToast } from "./services/ui";
import "./styles/tailwind.css";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);

const auth = useAuthStore(pinia);
auth.initializeAuth().catch(() => {
	showToast({
		title: "Session expired",
		message: "Please sign in again.",
		type: "warning",
	});
	router.push("/login");
});

window.addEventListener("auth:unauthorized", () => {
	auth.logout();
	showToast({
		title: "Unauthorized",
		message: "Please login to continue.",
		type: "warning",
	});
	router.push("/login");
});

app.mount("#app");
