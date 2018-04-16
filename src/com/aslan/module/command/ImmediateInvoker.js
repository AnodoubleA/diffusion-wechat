import Invoker from "./Invoker";
import Lookup from "../../config/lookup.js";

export default class ImmediateInvoker extends Invoker {

	invoke(command) {
		try {
			command.execute();
		} catch (error) {
			Lookup.notification.notify({name: "command.error", attachment: error});
		}
	}
}