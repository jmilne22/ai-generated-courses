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
  'go-course-activity'
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
