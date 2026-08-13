import { generateFontAwesome } from "./providers/font-awesome/generate";
import { generateDevicons } from "./providers/devicons/generate";
import { generateSimpleIcons } from "./providers/simple-icons/generate";
import { generateSimpleIconsFont } from "./providers/simple-icons-font/generate";

await generateFontAwesome();
await generateDevicons();
await generateSimpleIcons();
await generateSimpleIconsFont();
