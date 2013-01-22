define([
    'modules/chat'
],
function (Chat) {
    describe('Tests for ChatConversation collection', function () {
        it('Can add Model instance', function () {
            var usersList = new Chat.UsersList();

            expect(usersList.length).toBe(0);

            usersList.add({
                name: 'UserName',
                avatar: 'http://example/avatar.png'
            });

            expect(usersList.length).toBe(1);
        });
    });
});