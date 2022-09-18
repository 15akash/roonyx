import { Component, OnInit } from '@angular/core';

interface I_episode {
  id: number,
  name: string,
  url: string,
  air_date: string,
  characters: string[],
  created: string,
  episode: string,
}

interface I_character {
  created: string,
  episode: string[],
  gender: string,
  id: number,
  image: string,
  location: {},
  name: string,
  origin: {}
  species: string,
  status: string,
  type: string,
  url: string,
}

@Component({
  selector: 'app-http-request',
  templateUrl: './http-request.component.html',
  styleUrls: ['./http-request.component.scss']
})
export class HttpRequestComponent implements OnInit {

  isLoading: boolean = false;

  charactersList: I_character[] = [];
  charactersId: string[] = [];

  episodesList: I_episode[] = [];
  modifiedEpisodesList: I_episode[] = [];

  episodesPageCount: number = 1;
  totalEpisodesPageCount: number = 1;

  charactersObj: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  async getAllEpisodes() {
    if (this.episodesPageCount > this.totalEpisodesPageCount) {
      this.charactersId = [...new Set(this.charactersId)];
      return;
    } else {
      const episodesBaseUrl = `https://rickandmortyapi.com/api/episode/?page=${this.episodesPageCount}`;
      const response: any = await fetch(episodesBaseUrl).then(response => response.json())
      try {
        // pushing the data in episodes list.
        this.episodesList.push(...response.results);
        this.totalEpisodesPageCount = response.info.pages;
        let charactersUrl: string[] = [];
        for (let i = 0; i < this.episodesList.length; i++) {
          let charactersInOneEpisode: string[] = this.episodesList[i].characters;
          // creating characters Url array received from this api
          charactersUrl.push(...charactersInOneEpisode);
        }

        charactersUrl.forEach(item => {
          let id = item.lastIndexOf('/') + 1;
          let result = item.substring(id, item.length);
          // creating characters ID as array of string to get all the characters information in getAllCharacters function.
          this.charactersId.push(result);
        })
        this.episodesPageCount++;
        await this.getAllEpisodes();
      } catch (error) {
        alert(error)
        console.log(error)
      }

    }
  }

  async getAllCharacters() {
    const baseUrlForCharacters = `https://rickandmortyapi.com/api/character/${this.charactersId}`;
    const response: any = await fetch(baseUrlForCharacters).then(response => response.json())
    try {
      for (let character of response) {
        // created character list and pushing all the characters received from this api.
        this.charactersList.push(character)
        this.charactersObj[character.id] = character;
      }
    } catch (error) {
      alert(error)
      console.log(error)
    }
  }


  async modifyEpisodeArr() {
    if (this.modifiedEpisodesList.length) return;
    this.isLoading = true;
    await this.getAllEpisodes();
    await this.getAllCharacters();
    for (let i = 0; i < this.episodesList.length; i++) {
      this.episodesList[i].characters.forEach((item, index) => {
        let lastIndex = item.lastIndexOf('/') + 1;
        let id = item.substring(lastIndex, item.length)
        // replacing characters Urls with JSON object in all episodes and updating episodes list.
        this.episodesList[i].characters[index] = this.charactersObj[id]
      })
    }
    this.modifiedEpisodesList = this.episodesList;
    console.log(this.modifiedEpisodesList)
    this.isLoading = false;
  }
}
