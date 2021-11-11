<template>
  <div id="game">
    <div>Game Status : {{ gameStatus }}</div>
    <span>Logged Users : </span>
    <ul id="loggedUsers">
      <li v-for="user in loggedUsers" :key="user">{{ user }}</li>
    </ul>
    <button v-if="logged && gameStatus == 'Waiting'" @click="startGame">
      {{ buttonText }}
    </button>
    <div id="cards">
      <span v-for="card in deck" :key="card.id">
        {{ card.id }}
        <img
          class="card player-card"
          :src="'/cards/' + card.color + '_' + card.number + '.svg'"
          @click="playCard(card)"
      /></span>
    </div>
    <div id="players">
      <div class="player" v-for="player in loggedUsers" :key="player">
        <div v-if="player != username">
          <img
            class="card"
            v-for="index in gameDecksCardNumber[player]"
            :key="index"
            :src="'/cards/background.svg'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useStore } from "@/store";

import { getSocket } from "@/socket";

enum GameStatus {
  Waiting,
  Ongoing,
  Finished,
}

interface Card {
  color: string;
  number: string;
  id: number;
}

interface Data {
  loggedUsers: string[];
  gameDecksCardNumber: any;
  gameStatus: string;
  buttonText: string;
  deck: [];
}

export default defineComponent({
  data() {
    return <Data>{
      isLoading: false,
      loggedUsers: [],
      gameDecksCardNumber: {},
      gameStatus: "",
      buttonText: "StartGame",
      deck: [],
    };
  },
  components: {},
  setup() {
    const store = useStore();
    const socket = getSocket();
    return { store, socket };
  },
  computed: {
    logged() {
      return this.$store.state.logged;
    },
    username() {
      return this.$store.state.username;
    },
  },
  created() {
    this.socket.functions.updateLoggedUsers = (loggedUsers: string[]) => {
      this.loggedUsers = loggedUsers;
    };
    this.socket.functions.updateGameStatus = (gameStatus: number) => {
      this.gameStatus = GameStatus[gameStatus];
    };
    this.socket.functions.eventCardTransfer = (event: any) => {
      if (event.to == this.username) {
        this.deck.push(<never>event.card);
      }
      if (!this.gameDecksCardNumber[event.to]) {
        this.gameDecksCardNumber[event.to] = 0;
      }
      this.gameDecksCardNumber[event.to]++;
      if (this.gameDecksCardNumber[event.from]) {
        this.gameDecksCardNumber[event.from]--;
      }
    };
    this.socket.send("getLoggedUsers").then((message) => {
      this.loggedUsers = message.data;
    });
    this.socket.send("getGameStatus").then((message) => {
      this.gameStatus = GameStatus[message.data];
    });
  },
  props: {},
  methods: {
    async startGame() {
      this.socket.send("startGame");
    },
    async playCard(card: Card) {
      let hasPlayed = (await this.socket.send("playCard", card)).data;
      if (hasPlayed) {
        this.deck.splice(
          this.deck.findIndex((c: any) => c.id == card.id),
          1
        );
      }
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  max-width: 100px;
}
.player-card {
  cursor: pointer;
}
#cards {
}
</style>
