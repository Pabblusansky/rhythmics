import { Injectable } from '@angular/core';
import { PrivacySettings } from '../models/privacy-settings/privacy-settings.interface';

interface CacheItem {
  data: any;
  timestamp: number;
  expiresIn: number; 
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private readonly CACHE_PREFIX = 'rhythmics_cache_';
  private readonly USER_CACHE_PREFIX = 'rhythmics_user_cache_';

  constructor() {
    this.cleanExpiredItems();
  }

  private getCurrentUserId(): string {
    const userProfile = localStorage.getItem('user_profile');
    if (userProfile) {
      try {
        const parsed = JSON.parse(userProfile);
        if (parsed.id) {
          return parsed.id;
        }
      } catch (error) {
        console.warn('Failed to parse user_profile from localStorage');
      }
    }
    
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        if (payload.sub || payload.user_id || payload.id) {
          return payload.sub || payload.user_id || payload.id;
        }
      } catch (error) {
      }
      
      return 'user_' + this.simpleHash(accessToken);
    }
    
    console.warn('No user identification found, using anonymous user');
    return 'anonymous_user';
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private createUserKey(key: string): string {
    const userId = this.getCurrentUserId();
    return `${this.USER_CACHE_PREFIX}${userId}_${key}`;
  }

  set(key: string, data: any, expiresInHours: number = 24): void {
    const privacySettings = this.getPrivacySettings();
    
    if (!privacySettings.storeListeningHistory) {
      console.log('Caching disabled by privacy settings');
      return;
    }

    const item: CacheItem = {
      data,
      timestamp: Date.now(),
      expiresIn: expiresInHours * 60 * 60 * 1000 
    };

    try {
      const userKey = this.createUserKey(key);
      localStorage.setItem(userKey, JSON.stringify(item));
      console.log(`Cached ${key} for user ${this.getCurrentUserId()} for ${expiresInHours} hours`);
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  get(key: string): any | null {
    const privacySettings = this.getPrivacySettings();
    
    if (!privacySettings.storeListeningHistory) {
      return null;
    }

    try {
      const userKey = this.createUserKey(key);
      const cached = localStorage.getItem(userKey);
      if (!cached) return null;

      const item: CacheItem = JSON.parse(cached);
      const now = Date.now();
      
      if (now - item.timestamp > item.expiresIn) {
        this.remove(key);
        console.log(`Cache expired for ${key}`);
        return null;
      }

      const maxAge = this.getMaxCacheAge();
      if (now - item.timestamp > maxAge) {
        this.remove(key);
        console.log(`Cache removed due to retention policy: ${key}`);
        return null;
      }

      console.log(`Cache hit for ${key} (user: ${this.getCurrentUserId()})`);
      return item.data;
    } catch (error) {
      console.warn('Failed to read cache:', error);
      return null;
    }
  }

  remove(key: string): void {
    const userKey = this.createUserKey(key);
    localStorage.removeItem(userKey);
  }

  clear(): void {
    const userId = this.getCurrentUserId();
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(`${this.USER_CACHE_PREFIX}${userId}_`)
    );
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log(`All cache cleared for user ${userId}`);
  }

  clearCurrentUserCache(): void {
    this.clear();
  }

  // Admin methods for managing all users' cache
  clearAllUsersCache(): void {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.USER_CACHE_PREFIX) || key.startsWith(this.CACHE_PREFIX)
    );
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log('All users cache cleared');
  }

  clearByType(type: 'tracks' | 'artists' | 'genres' | 'profile'): void {
    const userId = this.getCurrentUserId();
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(`${this.USER_CACHE_PREFIX}${userId}_`) && key.includes(type)
    );
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log(`${type} cache cleared for user ${userId}`);
  }

  clearOldCache(olderThanHours: number = 24): void {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.CACHE_PREFIX)
    );

    const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);

    keys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (!cached) return;

        const item: CacheItem = JSON.parse(cached);
        
        if (item.timestamp < cutoffTime) {
          localStorage.removeItem(key);
          console.log(`Old cache removed: ${key}`);
        }
      } catch (error) {
        localStorage.removeItem(key);
      }
    });
  }

  cleanExpiredItems(): void {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.CACHE_PREFIX)
    );

    const now = Date.now();
    const maxAge = this.getMaxCacheAge();

    keys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (!cached) return;

        const item: CacheItem = JSON.parse(cached);
        
        if (now - item.timestamp > item.expiresIn || 
            now - item.timestamp > maxAge) {
          localStorage.removeItem(key);
          console.log(`Expired cache removed: ${key}`);
        }
      } catch (error) {
        localStorage.removeItem(key);
      }
    });
  }

  getCacheStats(): { totalItems: number; totalSize: number; oldestItem: number | null } {
    const userId = this.getCurrentUserId();
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(`${this.USER_CACHE_PREFIX}${userId}_`)
    );

    let totalSize = 0;
    let oldestTimestamp: number | null = null;

    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += value.length;
        
        try {
          const item: CacheItem = JSON.parse(value);
          if (!oldestTimestamp || item.timestamp < oldestTimestamp) {
            oldestTimestamp = item.timestamp;
          }
        } catch (error) {
        }
      }
    });

    return {
      totalItems: keys.length,
      totalSize: Math.round(totalSize / 1024),
      oldestItem: oldestTimestamp
    };
  }

  private getPrivacySettings(): PrivacySettings {
    const saved = localStorage.getItem('rhythmics_privacy_settings');
    return saved ? JSON.parse(saved) : {
      showTopTracks: true,
      showTopArtists: true,
      showGenreAnalytics: true,
      storeListeningHistory: true,
      shareWithFriends: false,
      publicProfile: false,
      dataRetentionDays: 365,
      showRecentlyPlayed: false
    };
  }

  private getMaxCacheAge(): number {
    const settings = this.getPrivacySettings();
    return settings.dataRetentionDays * 24 * 60 * 60 * 1000; 
  }
}