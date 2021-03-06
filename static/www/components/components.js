import {MessageComponent} from "/www/components/message.component.js";
import {AlertComponent} from "./alert.component.js";
import {PageLoading} from "./pageLoading.component.js";
import {SnackComponent} from "./snack.component.js";
window.customElements.define("ztwx-message",MessageComponent);
window.customElements.define("ztwx-alert",AlertComponent);
window.customElements.define("ztwx-pageloading",PageLoading);
window.customElements.define("ztwx-snack",SnackComponent);