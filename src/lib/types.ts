export interface AppStoreApp {
  trackId: number;
  trackName: string;
  bundleId: string;
  artistName: string;
  artistId: number;
  artworkUrl60: string;
  artworkUrl100: string;
  artworkUrl512: string;
  price: number;
  formattedPrice: string;
  currency: string;
  version: string;
  description: string;
  releaseDate: string;
  currentVersionReleaseDate: string;
  minimumOsVersion: string;
  fileSizeBytes: string;
  contentAdvisoryRating: string;
  trackContentRating: string;
  primaryGenreName: string;
  primaryGenreId: number;
  genres: string[];
  genreIds: string[];
  averageUserRating: number;
  userRatingCount: number;
  averageUserRatingForCurrentVersion: number;
  userRatingCountForCurrentVersion: number;
  trackViewUrl: string;
  artistViewUrl: string;
  sellerName: string;
  sellerUrl?: string;
  features: string[];
  supportedDevices: string[];
  advisories: string[];
  languageCodesISO2A: string[];
  screenshotUrls: string[];
  ipadScreenshotUrls: string[];
  appletvScreenshotUrls: string[];
  isGameCenterEnabled: boolean;
  isVppDeviceBasedLicensingEnabled: boolean;
  kind: string;
  wrapperType: string;
}

export interface AppStoreLookupResponse {
  resultCount: number;
  results: AppStoreApp[];
}
