
import Role from '../RoleItem';
import Session from './Session';

const app = getApp();
const serverUrl = app.globalData.serverUrl;

const input = {
	seat: 0,
};

function restoreState() {
	let state = 'init';
	if (this.data.roomKey) {
		const session = new Session(this.data.roomKey);

		if (session.role && session.seat) {
			state = 'loaded';
			this.showRole(session);
		}
	}
	this.setData({ state });
}

function fetchRole() {
	const session = new Session(this.data.roomKey);

	if (session.role || session.seat) {
		return;
	}

	wx.request({
		method: 'GET',
		url: serverUrl + 'role',
		data: {
			id: this.data.roomId,
			seat: input.seat,
			seatKey: session.seatKey
		},
		success: res => {
			if (res.statusCode === 404) {
				let message = '未知404错误';
				if (res.data === 'The room does not exist') {
					message = '房间已失效，请重新创建房间。';
				} else if (res.data === 'The seat does not exist') {
					message = '无效座位号，请输入 1 ~ ' + this.data.playerNum;
					this.setData({state: 'init'});
				}
				return wx.showToast({
					title: message,
					icon: 'none',
				});
			} else if (res.statusCode === 409) {
				return wx.showToast({
					title: '座位已被占用，请使用其他座位。',
					icon: 'none',
					complete: () => this.setData({ state: 'init' })
				});
			} else if (res.statusCode === 403) {
				return wx.showToast({
					title: '请刷新网页缓存，然后重试。',
					icon: 'none',
				});
			} else if (res.statusCode != 200) {
				return wx.showToast({
					title: '查看身份失败。',
					icon: 'none',
				});
			}

			session.role = res.data.role;
			session.seat = res.data.seat;
			session.save();

			this.showRole(session);
		},
		fail: () => {
			session.save();
			wx.showToast({
				title: '本地网络故障，请确认设备可联网。',
				icon: 'none'
			});
			this.setData({ state: 'init' });
		}
	});
}

Component({

	properties: {
		roomId: {
			type: Number,
			value: 0,
		},
		roomKey: {
			type: String,
			value: '',
			observer: restoreState,
		},
		playerNum: {
			type: Number,
			value: 0,
		}
	},

	data: {
		state: 'prepare', // "prepare", "init", "loading", "loaded"
		role: 0,
		seat: 0,
		seatKey: 0,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		updateSeat: function (e) {
			input.seat = parseInt(e.detail.value, 10);
		},

		showRole: function (my) {
			const role = Role.fromNum(my.role);
			this.setData({
				state: 'loaded',
				seat: my.seat,
				seatKey: my.seatKey,
				role: role,
			});
		},

		fetchRole: function () {
			let roomId = this.data.roomId;
			if (roomId <= 0 || isNaN(roomId)) {
				return wx.showToast({
					title: '房间号错误。',
					icon: 'none'
				});
			}

			let seat = input.seat;
			if (seat <= 0 || isNaN(seat)) {
				return wx.showToast({
					title: '请输入座位号。',
					icon: 'none'
				});
			}

			this.setData({ state: 'loading' });
			fetchRole.call(this);
		},
	}
})
