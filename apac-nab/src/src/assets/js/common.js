function enableEnterKeyOnButtonId(buttonId) {
    if (!buttonId.startsWith('#')) {
        buttonId = '#' + buttonId;
    }

    $(document).on('keydown.enterHandler', function(event) {
        if (event.key === 'Enter') {
            const $nextButton = $(buttonId);
            if ($nextButton.is(':enabled')) {
                $nextButton.trigger('click');
            }
        }
    });
}
