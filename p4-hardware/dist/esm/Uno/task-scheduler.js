export class MicroTaskScheduler {
    constructor() {
        this.messageName = 'zero-timeout-message';
        this.executionQueue = [];
        this.stopped = true;
        this.handleMessage = (event) => {
            if (event.data === this.messageName) {
                event.stopPropagation();
                const executeJob = this.executionQueue.shift();
                if (executeJob !== undefined) {
                    executeJob();
                }
            }
        };
    }
    start() {
        if (this.stopped) {
            this.stopped = false;
            window.addEventListener('message', this.handleMessage, true);
        }
    }
    stop() {
        this.stopped = true;
        window.removeEventListener('message', this.handleMessage, true);
    }
    postTask(fn) {
        if (!this.stopped) {
            this.executionQueue.push(fn);
            window.postMessage(this.messageName, '*');
        }
    }
}
