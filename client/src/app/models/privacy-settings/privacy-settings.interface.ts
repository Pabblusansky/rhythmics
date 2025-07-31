export interface PrivacySettings {
  showTopTracks: boolean;
  showTopArtists: boolean;
  showGenreAnalytics: boolean;
  storeListeningHistory: boolean;
  shareWithFriends: boolean;
  publicProfile: boolean;
  dataRetentionDays: number;
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  showTopTracks: true,
  showTopArtists: true,
  showGenreAnalytics: true,
  storeListeningHistory: true,
  shareWithFriends: false,
  publicProfile: false,
  dataRetentionDays: 365
};