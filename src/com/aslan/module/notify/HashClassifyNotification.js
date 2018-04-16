import ClassifyNotification from "./ClassifyNotification";

let statics = new Map();

export default class HashClassifyNotification extends ClassifyNotification {

    content = new Map();

    addNotifier(name, notifier, global) {
        let map = global ? statics : this.content;
        let list = map.get(name);
        if (!list) {
            map.set(name, list = []);
        }
        list.push(notifier);
    }

    removeNotifier(name, notifier, global) {
        let map = global ? statics : this.content;
        let list = map.get(name);
        if (list) {
            list.remove(notifier);
        }
    }

    notify(event) {
        this.doNotify(event, statics.get(event.name));
        if (!event.stopPropagation) {
            this.doNotify(event, this.content.get(event.name));
        }
    }

    doNotify(event, list) {
        let size = (list && list.length) || 0;
        if (size === 0) return;
        for (let i = 0; i < size; i++) {
            try {
                let notifier = list[i];
                if (notifier instanceof Function) {
                    notifier.call(this, event);
                } else {
                    list[i].action(event);
                }
                if (event.stopImmediatePropagation) break;
            } catch (error) {
                console.error(error);
            }
        }
    }
}