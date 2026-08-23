<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import UseIDFMHorizontal from "./messages/UseIDFMHorizontal.vue";
import PanelTransition from "./animations/PanelTransition.vue";
import TravauxIcon from "./icons/TravauxIcon.vue";
import DefaultIcon from "./icons/DefaultIcon.vue";
import type { SimpleNotification } from "../services/Wagon";

const props = defineProps<{
  disruptions: any[];
  side: "BOTTOM" | "LEFT";
  notifications?: SimpleNotification[];
}>();

const currentIndex = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

const notifications = computed(() => props.notifications ?? []);

const hasNotifications = computed(() => notifications.value.length > 0);

const current = computed(() => {
  if (notifications.value.length === 0) {
    return undefined;
  }
  return notifications.value[currentIndex.value % notifications.value.length];
});

const severityClass = computed(() => {
  const notification = current.value;
  if (!notification) {
    return "gray";
  }
  if ((notification.contentFR ?? "").toLowerCase().includes("interr")) {
    return "red";
  }
  const durationMs =
    notification.estimatedEndTime && notification.publishedAt
      ? notification.estimatedEndTime.diff(notification.publishedAt)
      : undefined;
  if (durationMs !== undefined && durationMs < 24 * 60 * 60 * 1000) {
    return "orange";
  }
  return "gray";
});

const disruptionPanels = [
  {
    title: "Information travaux",
    icon: TravauxIcon,
    match: (content: string) => /travaux/i.test(content),
  },
  {
    title: "Information",
    icon: DefaultIcon,
    match: () => true,
  },
];

const currentPanel = computed(() => {
  const content = current.value?.contentFR ?? "";
  return (
    disruptionPanels.find((panel) => panel.match(content)) ??
    disruptionPanels[disruptionPanels.length - 1]
  );
});

function startTimer() {
  stopTimer();
  if (notifications.value.length > 1) {
    timer = setInterval(() => {
      currentIndex.value =
        (currentIndex.value + 1) % notifications.value.length;
    }, 10_000);
  }
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

onMounted(startTimer);
onUnmounted(stopTimer);
watch(notifications, () => {
  currentIndex.value = 0;
  startTimer();
});
</script>

<template>
  <div
    :class="side === 'LEFT' ? 'left' : 'bottom'"
    :style="{ height: side === 'LEFT' ? '66vh' : '17.2vh' }"
  >
    <PanelTransition
      v-if="hasNotifications"
      :direction="side === 'BOTTOM' ? 'vertical' : 'horizontal'"
    >
      <aside
        :key="currentIndex"
        :class="[severityClass, side === 'LEFT' ? 'left-pane' : 'bottom-pane']"
      >
        <header v-if="side === 'LEFT'">
          <component :is="currentPanel.icon" />
          <h2>{{ currentPanel.title }}</h2>
        </header>
        <component :is="currentPanel.icon" v-else />
        <span class="message">{{ current?.contentFR }}</span>
      </aside>
    </PanelTransition>
    <aside
      v-else
      :class="{ deprecated: side === 'LEFT' }"
      :style="{ height: side === 'LEFT' ? '66vh' : '17.2vh' }"
    >
      <template v-if="side === 'LEFT'">
        <header>
          <TravauxIcon />
          <h2>Information travaux</h2>
        </header>
        <span
          >Retrouvez toutes les informations sur l’appli Wagon, le site
          getwagon.fr ou votre appli de mobilité et sur le fil Twitter de votre
          ligne.</span
        >
      </template>
      <UseIDFMHorizontal v-else />
    </aside>
  </div>
</template>

<style scoped>
div.left,
div.bottom {
  width: 100%;
  overflow: hidden;
  border-radius: 0 0.8vh 0.8vh 0;
}

aside {
  box-sizing: border-box;
  padding: 1.5vh;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 2vh;
  align-items: center;
  color: var(--text);
}

aside.deprecated,
aside.left-pane {
  background-color: var(--worksite-background);
  flex-direction: column;
  align-items: flex-start;
}

aside.bottom-pane {
  background-color: var(--worksite-background);
  padding-right: 18vh;
}

aside.red {
  background-color: var(--alert-background);
}

aside.orange {
  background-color: var(--worksite-background);
}

aside.gray {
  background-color: #8a8a8a;
}

.bottom .message {
  padding-right: 0;
}

.left .message {
  padding-right: 4vh;
}

header {
  display: flex;
  align-items: center;
  gap: 3vh;
}

span {
  display: block;
  font-size: 4vh;
  color: var(--on-worksite-background);
}

.message {
  color: var(--text);
}

.bottom h2 {
  display: none;
}

h2 {
  margin: 0;
  font-size: 4.5vh;
  color: var(--on-worksite-background);
}

.bottom :deep(svg) {
  height: 8vh;
  width: auto;
}

.left :deep(svg) {
  height: 10vh;
  width: auto;
}

.left aside.deprecated :deep(svg) {
  fill: var(--on-worksite-background);
}
</style>