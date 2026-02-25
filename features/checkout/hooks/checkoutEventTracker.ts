// Theo dõi sự kiện checkout 3 bước

export type CheckoutEventType =
  | "STEP_START"
  | "STEP_COMPLETE"
  | "NAVIGATION_IN_PROGRESS"
  | "NAVIGATION_COMPLETE";

export interface CheckoutEvent {
  type: CheckoutEventType;
  step: "cart" | "checkout" | "completed";
  timestamp: number;
  duration?: number;
}

class CheckoutEventTracker {
  private events: CheckoutEvent[] = [];
  private stepDurations: Map<string, number> = new Map();
  private stepStartTimes: Map<string, number> = new Map();
  private listeners: ((event: CheckoutEvent) => void)[] = [];

  // Ghi nhận bắt đầu bước
  trackStepStart(step: "cart" | "checkout" | "completed") {
    this.stepStartTimes.set(step, Date.now());
    const event: CheckoutEvent = {
      type: "STEP_START",
      step,
      timestamp: Date.now(),
    };
    this.events.push(event);
    this.notifyListeners(event);
    if (process.env.NODE_ENV === "development") {
      console.log(`[Checkout] Step started: ${step}`, event);
    }
  }

  // Ghi nhận hoàn thành bước và tính thời gian
  trackStepComplete(step: "cart" | "checkout" | "completed") {
    const startTime = this.stepStartTimes.get(step);
    const duration = startTime ? Date.now() - startTime : 0;
    this.stepDurations.set(step, duration);
    const event: CheckoutEvent = {
      type: "STEP_COMPLETE",
      step,
      timestamp: Date.now(),
      duration,
    };
    this.events.push(event);
    this.notifyListeners(event);
    if (process.env.NODE_ENV === "development") {
      console.log(`[Checkout] Step completed: ${step} (${duration}ms)`, event);
    }
  }

  // Ghi nhận chuyển hướng giữa các bước (300ms)
  trackNavigation(
    fromStep: "cart" | "checkout" | "completed",
    toStep: "cart" | "checkout" | "completed",
  ) {
    const startEvent: CheckoutEvent = {
      type: "NAVIGATION_IN_PROGRESS",
      step: fromStep,
      timestamp: Date.now(),
    };
    this.events.push(startEvent);
    this.notifyListeners(startEvent);
    setTimeout(() => {
      const completeEvent: CheckoutEvent = {
        type: "NAVIGATION_COMPLETE",
        step: toStep,
        timestamp: Date.now(),
      };
      this.events.push(completeEvent);
      this.notifyListeners(completeEvent);
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[Checkout] Navigation complete: ${fromStep} → ${toStep}`,
          completeEvent,
        );
      }
    }, 300);
  }

  // Lấy thời gian bước (ms)
  getStepDuration(step: string): number {
    return this.stepDurations.get(step) || 0;
  }

  // Lấy tất cả sự kiện
  getEvents(): CheckoutEvent[] {
    return [...this.events];
  }

  // Lấy tổng thời gian checkout
  getTotalDuration(): number {
    if (this.events.length === 0) return 0;
    const firstEvent = this.events[0];
    const lastEvent = this.events[this.events.length - 1];
    return lastEvent.timestamp - firstEvent.timestamp;
  }

  // Đăng ký lắng nghe sự kiện
  subscribe(listener: (event: CheckoutEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Thông báo cho tất cả listener
  private notifyListeners(event: CheckoutEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  // Đặt lại theo dõi
  reset() {
    this.events = [];
    this.stepDurations.clear();
    this.stepStartTimes.clear();
    this.listeners = [];
  }
}

// Tạo singleton instance
export const checkoutEventTracker = new CheckoutEventTracker();
