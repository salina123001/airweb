// components/admin/MemberManagement.tsx
import React, { useState, useEffect } from 'react';
import { memberService, Member } from '../../services/firebaseService';

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const memberList = await memberService.getAllMembers();
      setMembers(memberList);
    } catch (error) {
      console.error('載入會員資料失敗:', error);
      alert('載入會員資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMember = async (memberId: string, updates: Partial<Member>) => {
    try {
      await memberService.updateMember(memberId, updates);
      await loadMembers();
      setEditingMember(null);
      alert('會員資料更新成功');
    } catch (error) {
      console.error('更新會員資料失敗:', error);
      alert('更新會員資料失敗');
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (window.confirm(`確定要刪除會員「${memberName}」嗎？`)) {
      try {
        await memberService.deleteMember(memberId);
        await loadMembers();
        alert('會員刪除成功');
      } catch (error) {
        console.error('刪除會員失敗:', error);
        alert('刪除會員失敗');
      }
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="admin-loading">載入中...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>會員管理</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>總會員數</h3>
            <p className="stat-number">{members.length}</p>
          </div>
          <div className="stat-card">
            <h3>活躍會員</h3>
            <p className="stat-number">{members.filter(m => m.isActive).length}</p>
          </div>
        </div>
      </div>

      <div className="admin-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜尋會員姓名或信箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={loadMembers} className="btn btn-refresh">
          重新載入
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>信箱</th>
              <th>電話</th>
              <th>地址</th>
              <th>註冊時間</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone || '未提供'}</td>
                <td>{member.address || '未提供'}</td>
                <td>{member.createdAt?.toDate().toLocaleDateString()}</td>
                <td>
                  <span className={`status ${member.isActive ? 'active' : 'inactive'}`}>
                    {member.isActive ? '活躍' : '停用'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => setEditingMember(member)}
                      className="btn btn-edit"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleUpdateMember(member.id!, { isActive: !member.isActive })}
                      className={`btn ${member.isActive ? 'btn-disable' : 'btn-enable'}`}
                    >
                      {member.isActive ? '停用' : '啟用'}
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id!, member.name)}
                      className="btn btn-delete"
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 編輯會員彈窗 */}
      {editingMember && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>編輯會員資料</h2>
              <button 
                onClick={() => setEditingMember(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>姓名</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    name: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>信箱</label>
                <input
                  type="email"
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    email: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>電話</label>
                <input
                  type="text"
                  value={editingMember.phone || ''}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    phone: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>地址</label>
                <textarea
                  value={editingMember.address || ''}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    address: e.target.value
                  })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setEditingMember(null)}
                className="btn btn-cancel"
              >
                取消
              </button>
              <button
                onClick={() => handleUpdateMember(editingMember.id!, editingMember)}
                className="btn btn-save"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 基本樣式 */}
      <style>{`
        .admin-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-header {
          margin-bottom: 30px;
        }

        .admin-header h1 {
          color: #333;
          margin-bottom: 20px;
        }

        .admin-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          min-width: 120px;
        }

        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
        }

        .stat-number {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
        }

        .admin-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .search-input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 300px;
        }

        .admin-table-container {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .admin-table th,
        .admin-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .admin-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .status.active {
          background: #d4edda;
          color: #155724;
        }

        .status.inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .btn-edit {
          background: #007bff;
          color: white;
        }

        .btn-enable {
          background: #28a745;
          color: white;
        }

        .btn-disable {
          background: #ffc107;
          color: #212529;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
        }

        .btn-refresh {
          background: #6c757d;
          color: white;
          padding: 10px 20px;
        }

        .btn:hover {
          opacity: 0.8;
          transform: translateY(-1px);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          color: #333;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .modal-body {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group textarea {
          height: 80px;
          resize: vertical;
        }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
          padding: 10px 20px;
        }

        .btn-save {
          background: #007bff;
          color: white;
          padding: 10px 20px;
        }

        .admin-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default MemberManagement;