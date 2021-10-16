
import { PWA } from "$lib/pwa/";

import {
	colorTheme, //
	firebase, //
} from "$lib/utils";

export async function onMountFunction() {
	await PWA.preparePwa();
	colorTheme.setInitial();
	firebase.init();
}

