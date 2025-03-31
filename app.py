from flask import Flask, request, jsonify, render_template, url_for
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime
from scr.deepseek import deepseek
# 初始化Flask应用
app = Flask(__name__)
CORS(app)

# 配置参数
app.config.update({
    'UPLOAD_FOLDER': 'static/uploads/',
    'GROWTH_UPLOAD_FOLDER': 'static/img/old/',
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///growth.db',
    'SQLALCHEMY_TRACK_MODIFICATIONS': False
})

# 初始化数据库
db = SQLAlchemy(app)

# 数据库模型
class Growth(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    upload_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

# 确保上传目录存在
for folder in [app.config['UPLOAD_FOLDER'], app.config['GROWTH_UPLOAD_FOLDER']]:
    if not os.path.exists(folder):
        os.makedirs(folder)

# 创建数据库表
with app.app_context():
    db.create_all()

@app.route('/')
def case():
    # 获取成长记录
    growths = Growth.query.order_by(Growth.upload_date.asc()).all()
    return render_template("index.html", growths=growths)

@app.route('/upload', methods=['POST'])
def upload():
    # 普通图片上传（原有功能）
    if 'image' not in request.files:
        return jsonify(success=False, message='没有文件上传')
    
    file = request.files['image']
    if file.filename == '':
        return jsonify(success=False, message='文件名为空')

    if file:
        filename = datetime.now().strftime('%Y%m%d%H%M%S') + os.path.splitext(file.filename)[-1]
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        image_url = url_for('static', filename='uploads/' + filename)
        return jsonify(success=True, imageUrl=image_url, date=datetime.now().strftime('%Y/%m/%d'))

    return jsonify(success=False, message='上传失败')

@app.route('/upload-growth', methods=['POST'])
def upload_growth():
    # 新增成长历程专用上传接口
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        # 生成唯一文件名
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = f"{timestamp}.{ext}"
        
        # 保存文件
        file.save(os.path.join(app.config['GROWTH_UPLOAD_FOLDER'], filename))
        
        # 保存到数据库
        new_growth = Growth(filename=filename)
        db.session.add(new_growth)
        db.session.commit()
        
        return jsonify({
            'filename': url_for('static', filename=f'img/old/{filename}'),
            'date': new_growth.upload_date.strftime("%Y/%m/%d")
        }), 200
    return jsonify({'error': 'Invalid file type'}), 400

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}

@app.route('/delete-growth', methods=['POST'])
def delete_growth():
    """Delete growth records (single or batch)"""
    try:
        data = request.get_json()
        if not data or 'ids' not in data:
            return jsonify({'success': False, 'message': 'Invalid request'}), 400
            
        ids = data['ids']
        if not isinstance(ids, list):
            ids = [ids]
            
        deleted_count = 0
        for id in ids:
            growth = Growth.query.get(id)
            if growth:
                # Delete file from filesystem
                file_path = os.path.join(app.config['GROWTH_UPLOAD_FOLDER'], growth.filename)
                if os.path.exists(file_path):
                    os.remove(file_path)
                    
                # Delete from database
                db.session.delete(growth)
                deleted_count += 1
                
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'成功删除{deleted_count}条记录'
        }), 200
    except Exception as e:
        print(f"Delete error: {e}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': '删除失败'
        }), 500

@app.route('/api/deepseek', methods=['POST'])
def deepseek_chat():
    """Handle DeepSeek chat requests"""
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Invalid request'}), 400
            
        response = deepseek.chat(data['message'])
        return jsonify({'response': response})
        
    except Exception as e:
        print(f"DeepSeek endpoint error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
