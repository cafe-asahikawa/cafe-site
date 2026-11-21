// 営業日カレンダー（外部サービス不要）
(function () {
  // ▼ 設定（ここだけ書き換えれば更新できます）
  var openWeekdays = [0, 6];   // 営業する曜日（0=日, 6=土）
  var closedDates = [];        // 臨時休業日 例: "2026-12-27"
  var extraOpenDates = [];     // 平日の臨時営業日 例: "2026-12-24"
  // ▲ ここまで

  var box = document.getElementById("calendar-box");
  if (!box) return;

  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function key(y, m, d) { return y + "-" + pad(m + 1) + "-" + pad(d); }

  function render() {
    box.textContent = "";

    var head = document.createElement("div");
    head.className = "cal-head";

    var prev = document.createElement("button");
    prev.type = "button";
    prev.textContent = "←";
    prev.setAttribute("aria-label", "前の月");
    prev.addEventListener("click", function () {
      month--;
      if (month < 0) { month = 11; year--; }
      render();
    });

    var title = document.createElement("strong");
    title.textContent = year + "年" + (month + 1) + "月";

    var next = document.createElement("button");
    next.type = "button";
    next.textContent = "→";
    next.setAttribute("aria-label", "次の月");
    next.addEventListener("click", function () {
      month++;
      if (month > 11) { month = 0; year++; }
      render();
    });

    head.appendChild(prev);
    head.appendChild(title);
    head.appendChild(next);
    box.appendChild(head);

    var table = document.createElement("table");
    table.className = "cal-table";

    var days = ["日", "月", "火", "水", "木", "金", "土"];
    var trh = document.createElement("tr");
    days.forEach(function (d) {
      var th = document.createElement("th");
      th.textContent = d;
      trh.appendChild(th);
    });
    table.appendChild(trh);

    var firstDay = new Date(year, month, 1).getDay();
    var lastDate = new Date(year, month + 1, 0).getDate();
    var d = 1;

    for (var w = 0; w < 6 && d <= lastDate; w++) {
      var tr = document.createElement("tr");
      for (var i = 0; i < 7; i++) {
        var td = document.createElement("td");
        if ((w === 0 && i < firstDay) || d > lastDate) {
          td.className = "empty";
        } else {
          var k = key(year, month, d);
          var isOpen = openWeekdays.indexOf(i) !== -1 || extraOpenDates.indexOf(k) !== -1;
          if (closedDates.indexOf(k) !== -1) isOpen = false;
          td.textContent = d;
          td.className = isOpen ? "open" : "off";
          if (closedDates.indexOf(k) !== -1) td.className += " closed";
          if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
            td.className += " today";
          }
          d++;
        }
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    box.appendChild(table);
  }

  render();
})();
