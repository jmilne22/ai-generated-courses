var BACKUP_KEYS = [
  'go-course-progress',
  'go-course-exercise-progress',
  'go-course-srs',
  'go-course-personal-notes',
  'go-course-last-module',
  'go-course-theme',
  'go-course-focus-mode',
  'go-course-timer-sound',
  'go-course-sidebar',
  'go-course-streaks',
  'go-course-activity',
  'go-course-session'
];

window.exportAllData = function () {
  var data = {};
  var keyCount = 0;

  BACKUP_KEYS.forEach(function (key) {
    var raw = localStorage.getItem(key);
    if (raw === null) return;
    keyCount++;
    try {
      data[key] = JSON.parse(raw);
    } catch (e) {
      data[key] = raw;
    }
  });

  if (keyCount === 0) {
    alert('No course data found to export.');
    return;
  }

  data._meta = {
    exportDate: new Date().toISOString(),
    version: 1,
    keys: keyCount
  };

  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  var date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = 'go-course-backup-' + date + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

window.importAllData = function (file) {
  var reader = new FileReader();

  reader.onload = function (e) {
    var data;
    try {
      data = JSON.parse(e.target.result);
    } catch (err) {
      alert('Invalid backup file: could not parse JSON.');
      return;
    }

    if (!data._meta) {
      alert('Invalid backup file: missing metadata.');
      return;
    }

    if (!confirm('This will overwrite your current progress. Continue?')) {
      return;
    }

    var restored = 0;
    BACKUP_KEYS.forEach(function (key) {
      if (!(key in data)) return;
      var val = data[key];
      if (typeof val === 'string') {
        localStorage.setItem(key, val);
      } else {
        localStorage.setItem(key, JSON.stringify(val));
      }
      restored++;
    });

    alert('Restore complete: ' + restored + ' key(s) restored.');
    location.reload();
  };

  reader.readAsText(file);
};

window.nukeEverything = function () {
  if (!confirm('This will permanently delete ALL course data, localStorage, and service worker caches. There is no undo. Continue?')) {
    return;
  }
  if (!confirm('Are you really sure? Export your data first if you want to keep it.')) {
    return;
  }

  // Clear all known keys
  BACKUP_KEYS.forEach(function (key) {
    localStorage.removeItem(key);
  });

  // Also nuke any go-course key we might have missed
  var toRemove = [];
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k && k.indexOf('go-course') === 0) {
      toRemove.push(k);
    }
  }
  toRemove.forEach(function (k) {
    localStorage.removeItem(k);
  });

  // Unregister service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      registrations.forEach(function (reg) {
        reg.unregister();
      });
    });
  }

  // Delete all caches
  if ('caches' in window) {
    caches.keys().then(function (names) {
      names.forEach(function (name) {
        caches.delete(name);
      });
    });
  }

  alert('Everything nuked. Page will reload.');
  location.reload();
};
