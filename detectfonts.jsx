var p = new ActionReference();

function arrayUnique(a) {
    var t = []
    i = a.length;

    while (i--) {
        var f = false,
            n = t.length;

        while (n--) {
            if (a[i] === t[n]) {
                f = true;
            }
        }

        if (!f) {
            t.push(a[i]);
        }
    }
    return t;
}

function findFonts() {
    p.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));

    var c = executeActionGet(p).getInteger(charIDToTypeID('NmbL')) + 1,
        fonts = [];

    while (c--) {
        var r = new ActionReference(),
            descLayer,
            layerStyles,
            countStyles;

        r.putIndex(charIDToTypeID('Lyr '), c);

        try {
            descLayer = executeActionGet(r);
        } catch (e) {
            continue;
        }

        if (!descLayer.hasKey(stringIDToTypeID('textKey'))) continue;

        layerStyles = descLayer.getObjectValue(stringIDToTypeID('textKey')).getList(stringIDToTypeID('textStyleRange'));
		if(!layerStyles) continue;
			
        countStyles = layerStyles.count;

        while (countStyles--) {
			var textStyle = layerStyles.getObjectValue(countStyles).getObjectValue(stringIDToTypeID('textStyle'));
			if(!textStyle || !textStyle.hasKey(stringIDToTypeID('fontPostScriptName'))) continue;
			
            var n = textStyle.getString(stringIDToTypeID('fontPostScriptName'));
            fonts.push(n);
        }
    }

    return arrayUnique(fonts).sort();
}

function copyTextToClipboard( txt )
{
    const keyTextData         = app.charIDToTypeID('TxtD');
    const ktextToClipboardStr = app.stringIDToTypeID( "textToClipboard" );

    var textStrDesc = new ActionDescriptor();

    textStrDesc.putString( keyTextData, txt );
    executeAction( ktextToClipboardStr, textStrDesc, DialogModes.NO );
}

if (documents.length) {
    var d = findFonts();
    //alert(d.length + ' fonts found\n' + d.join('\n'));
	copyTextToClipboard(d.length + ' fonts found\n' + d.join('\n'));
} else {
    //alert('No fonts used in the active document.');
	copyTextToClipboard('No fonts used in the active document.');
}
