window.onload = function() {
	var table = getTable();
	makeSortable(makeFilterable(table));
}

function getTable() {
	var tables = document.getElementsByTagName('table');
	return tables[0];
}

//以下代码给表格排序
function makeSortable(table) {
	var thRows = table.tBodies[0].rows[0].cells;
	for (var i = 0; i < thRows.length; i++) {
		thRows[i].index = i;
		thRows[i].onclick = function() {
			var checked = false;                          //布尔变量checked记录当前点击的单元格是否已升序
			if (this.className == "ascend") {
				checked = true;
			}
			for (var i = 0; i < thRows.length; i++) {
				thRows[i].className = "";
			}
			if (checked) {
				this.className = "descend";
			} else {
				this.className = "ascend";
			}
			SortTheTable(table, this.index);              //传入当前排序的表格以及被点击的列的索引
		}
	}
	return table;
}

function SortTheTable(table, iCol) {
	var aTrs = new Array;
	var oTbody = table.tBodies[0];
	var colRows = oTbody.rows;

	for (var i = 1; i < colRows.length; i++) {
		aTrs.push(colRows[i]);
	}                                    //将表格的每一行放入备用数组

	if (table.sortCol == iCol) {         //判断上一次排序的列是否和现在需要排序的列是同一个
		aTrs.reverse();                  //如果是同一列，直接将表格转置
	} else {
		aTrs.sort(compareEle(iCol));
	}

	var oFragment = document.createDocumentFragment();

	for (var i = 0; i < aTrs.length; i++) {
		if (i % 2 != 0) {
			aTrs[i].className = "alternate";
		} else {
			aTrs[i].className = "";
		}
		oFragment.appendChild(aTrs[i]);
	}
	oTbody.appendChild(oFragment);     //将aTrs排序完毕以后，重新生成表格

	table.sortCol = iCol;              //记录最后一次排序的索引
}

function compareEle(iCol) {
	return function(oTR1, oTR2) {
		var v1 = oTR1.cells[iCol].textContent;
		var v2 = oTR2.cells[iCol].textContent;
		if (v1 < v2) {
			return -1;
		} else if (v1 > v2) {
			return 1;
		} else {
			return 0;
		}
	};
}

//以下代码给表格筛选
function makeFilterable(table) {
	var oTxt = document.createElement('input');
	oTxt.type = "text";
	var oBtn = document.createElement('input');
	oBtn.type = "button";
	oBtn.value = "filter";
	table.parentNode.appendChild(oTxt);                  //附加输入域
	table.parentNode.appendChild(oBtn);
	filterTheTable(table, oTxt, oBtn);
	return table;
}

function filterTheTable(table, oTxt, oBtn) {
	var oTbody = table.tBodies[0];
	var colRows = oTbody.rows;

	oBtn.onclick = function() {
		var aTrs = new Array;
		for(var i = 1; i < colRows.length; i++) {
			var checked = false;
			for(var j = 0; j < colRows[i].cells.length; j++) {
				var index = colRows[i].cells[j].innerHTML.search(oTxt.value);
				if (index != -1) {                        //search方法返回搜索字段的下标，若不等于-1表示能搜索到
					if (!checked) {                       //布尔变量checked记录此行是否已被加入新表格
						aTrs.push(colRows[i]);
						checked = true;
					}
					var str = colRows[i].cells[j].innerHTML;
					var substr1 = str.substring(0,index);
					var substr2 = oTxt.value;
					var substr3 = str.substring(index + substr2.length);
					colRows[i].cells[j].innerHTML = substr1 + "<span>" + substr2 + "</span>" + substr3;
					//在搜索字段的两端加入span标签，实现高亮
				}
			}
		}

		var aSpan = oTbody.getElementsByTagName('span');
		for (var i = 0; i < aSpan.length; i++) {
			aSpan[i].className = "active";
		}

		var oFragment = document.createDocumentFragment();

		for (var i = 0; i < aTrs.length; i++) {
			if (i % 2 != 0) {                        
				aTrs[i].className = "alternate";
			} else {
				aTrs[i].className = "";
			}
			oFragment.appendChild(aTrs[i]);
		}

		for (var i = oTbody.childNodes.length - 1; i > 1 ; i--) {
			oTbody.removeChild(oTbody.childNodes[i]);
		}
		oTbody.appendChild(oFragment);
	}
}
