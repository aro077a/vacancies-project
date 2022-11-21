const STORAGE_KEY = '__RECENT_SEARCHES__';

export class RecentSearchManager {
  static searches: string[] = [];

  constructor() {
    RecentSearchManager.init();
  }

  static init(): void {
    const items = localStorage.getItem(STORAGE_KEY);

    if (items) {
      RecentSearchManager.searches = JSON.parse(items);
    }
  }

  static updateStorage(search: string): void {
    const recentSearches = this.searches;

    if (recentSearches.length < 10 || !recentSearches.length) {
      recentSearches.unshift(search);
    } else {
      recentSearches.unshift(search);

      recentSearches.length = 10;
    }

    RecentSearchManager.searches = recentSearches;

    RecentSearchManager.save();
  }

  static save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(RecentSearchManager.searches));
  }
}
