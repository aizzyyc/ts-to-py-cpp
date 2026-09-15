export interface LearningResource {
  title: string;
  source: string;
  href: string;
  note: string;
}

const pythonTutorial: LearningResource = {
  title: "The Python Tutorial",
  source: "Python 官方文档",
  href: "https://docs.python.org/3/tutorial/",
  note: "按语言特性和标准库顺序学习，适合查概念的精确定义。",
};

const runoobPython: LearningResource = {
  title: "Python 3 教程",
  source: "菜鸟教程",
  href: "https://www.runoob.com/python3/python3-tutorial.html",
  note: "用短例子快速复习语法、容器、函数、模块和异常。",
};

const pythonResources: Record<string, LearningResource[]> = {
  "python-syntax": [pythonTutorial, runoobPython],
  "python-control-flow": [pythonTutorial, runoobPython],
  "python-functions": [pythonTutorial, runoobPython],
  "python-oop": [pythonTutorial, { ...runoobPython, title: "Python 面向对象", href: "https://www.runoob.com/python3/python3-object.html", note: "复习类、继承、方法和对象组织。" }],
  "python-iterators": [pythonTutorial, { ...runoobPython, title: "Python 迭代器与生成器", href: "https://www.runoob.com/python3/python3-iterator-generator.html", note: "用小例子理解惰性求值和 yield。" }],
  "python-packaging": [
    { title: "Installing Packages", source: "Python Packaging User Guide", href: "https://packaging.python.org/en/latest/tutorials/installing-packages/", note: "理解虚拟环境、pip 和依赖安装边界。" },
    { title: "venv — Creation of virtual environments", source: "Python 官方文档", href: "https://docs.python.org/3/library/venv.html", note: "查阅标准库 venv 的创建和激活方式。" },
  ],
  "python-files": [pythonTutorial, { title: "pathlib — Object-oriented filesystem paths", source: "Python 官方文档", href: "https://docs.python.org/3/library/pathlib.html", note: "查阅跨平台路径和文件操作 API。" }],
  "python-testing": [
    { title: "pytest documentation", source: "pytest 开源项目", href: "https://docs.pytest.org/en/stable/", note: "把练习扩展为可重复运行的测试。" },
    pythonTutorial,
  ],
  "python-http": [{ title: "urllib.request — Extensible library for opening URLs", source: "Python 官方文档", href: "https://docs.python.org/3/library/urllib.request.html", note: "理解标准库 HTTP 请求和响应边界。" }, pythonTutorial],
  "python-cli": [{ title: "argparse — Parser for command-line options", source: "Python 官方文档", href: "https://docs.python.org/3/library/argparse.html", note: "查阅参数、帮助文本和退出码行为。" }, pythonTutorial],
  "python-logging": [{ title: "logging — Logging facility for Python", source: "Python 官方文档", href: "https://docs.python.org/3/library/logging.html", note: "查阅 logger、handler、formatter 的职责。" }, pythonTutorial],
  "python-concurrency": [{ title: "concurrent.futures — Launching parallel tasks", source: "Python 官方文档", href: "https://docs.python.org/3/library/concurrent.futures.html", note: "比较线程池和进程池的适用边界。" }, pythonTutorial],
  "python-async": [{ title: "asyncio — Asynchronous I/O", source: "Python 官方文档", href: "https://docs.python.org/3/library/asyncio.html", note: "查阅协程、任务、取消和超时 API。" }, pythonTutorial],
  "python-sql": [{ title: "sqlite3 — DB-API 2.0 interface for SQLite databases", source: "Python 官方文档", href: "https://docs.python.org/3/library/sqlite3.html", note: "学习参数化查询和连接生命周期。" }, pythonTutorial],
  "python-data-models": [{ title: "dataclasses — Data Classes", source: "Python 官方文档", href: "https://docs.python.org/3/library/dataclasses.html", note: "查阅结构化数据对象和不可变配置。" }, { title: "typing — Support for type hints", source: "Python 官方文档", href: "https://docs.python.org/3/library/typing.html", note: "把类型提示用于边界设计，而不是当运行时校验。" }],
  "python-data": [{ title: "Data analysis in Python", source: "pandas 官方文档", href: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html", note: "把 JSON 记录逐步整理成可检查的表格数据。" }, runoobPython],
  "python-pandas": [{ title: "Getting started tutorials", source: "pandas 官方文档", href: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html", note: "查阅选择、缺失值、分组、合并和时间序列。" }, { title: "pandas GitHub", source: "pandas 开源项目", href: "https://github.com/pandas-dev/pandas", note: "观察成熟 Python 数据项目的测试和工程组织。" }],
  "python-numpy": [{ title: "NumPy quickstart", source: "NumPy 官方文档", href: "https://numpy.org/doc/stable/user/quickstart.html", note: "从数组、shape、axis 和向量化开始。" }, { title: "NumPy GitHub", source: "NumPy 开源项目", href: "https://github.com/numpy/numpy", note: "了解数值计算库的文档、测试和性能边界。" }],
  "python-numpy-linear": [{ title: "NumPy user guide", source: "NumPy 官方文档", href: "https://numpy.org/doc/stable/user/index.html", note: "继续学习广播、线性代数和随机采样。" }, pythonTutorial],
  "python-visualization": [{ title: "Matplotlib tutorials", source: "Matplotlib 官方文档", href: "https://matplotlib.org/stable/tutorials/index.html", note: "将统计问题转换成可读图表。" }, { title: "pandas visualization", source: "pandas 官方文档", href: "https://pandas.pydata.org/docs/user_guide/visualization.html", note: "用表格数据快速检查分布和异常值。" }],
  "python-scikit": [{ title: "Getting Started", source: "scikit-learn 官方文档", href: "https://scikit-learn.org/stable/getting_started.html", note: "查阅 estimator、Pipeline、评估和模型选择。" }, { title: "scikit-learn examples", source: "scikit-learn 开源项目", href: "https://scikit-learn.org/stable/auto_examples/index.html", note: "用可运行示例比较模型和数据处理策略。" }],
  "python-datasets": [{ title: "Cross-validation: evaluating estimator performance", source: "scikit-learn 官方文档", href: "https://scikit-learn.org/stable/modules/cross_validation.html", note: "理解切分、交叉验证和数据泄漏。" }, pythonTutorial],
  "python-pytorch-tensors": [{ title: "Learn the Basics", source: "PyTorch 官方教程", href: "https://pytorch.org/tutorials/beginner/basics/intro.html", note: "按 Tensor、数据、模型和优化顺序入门。" }, { title: "PyTorch examples", source: "PyTorch 开源项目", href: "https://github.com/pytorch/examples", note: "观察短小、低依赖的训练和推理示例。" }],
  "python-pytorch-models": [{ title: "Deep Learning with PyTorch: A 60 Minute Blitz", source: "PyTorch 官方教程", href: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html", note: "连接 Tensor、模型、损失和优化器。" }, { title: "PyTorch tutorials", source: "PyTorch 开源项目", href: "https://github.com/pytorch/tutorials", note: "查看从 beginner 到 advanced 的教程组织。" }],
  "python-pytorch-data": [{ title: "Datasets & DataLoaders", source: "PyTorch 官方教程", href: "https://pytorch.org/tutorials/beginner/basics/data_tutorial.html", note: "查阅 Dataset、DataLoader 和 batch 语义。" }, { title: "PyTorch examples", source: "PyTorch 开源项目", href: "https://github.com/pytorch/examples", note: "观察真实项目如何组织输入管线。" }],
  "python-pytorch-evaluation": [{ title: "Saving and Loading Models", source: "PyTorch 官方教程", href: "https://pytorch.org/tutorials/beginner/basics/saveloadrun_tutorial.html", note: "理解 checkpoint、恢复和推理模式。" }, { title: "PyTorch examples", source: "PyTorch 开源项目", href: "https://github.com/pytorch/examples", note: "比较不同任务的指标和实验记录。" }],
  "python-inference": [{ title: "Performance Tuning Guide", source: "PyTorch 官方教程", href: "https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html", note: "结合课程中的 batch、device 和推理资源预算继续查阅。" }, { title: "PyTorch examples", source: "PyTorch 开源项目", href: "https://github.com/pytorch/examples", note: "对照训练和推理入口的分离方式。" }],
  "python-deployment": [{ title: "FastAPI documentation", source: "FastAPI 开源项目", href: "https://fastapi.tiangolo.com/", note: "将类型化输入和健康检查组织成 HTTP 服务。" }, { title: "Python Packaging User Guide", source: "Python Packaging User Guide", href: "https://packaging.python.org/en/latest/", note: "补齐应用发布和依赖分发知识。" }],
  "python-mlops": [{ title: "Machine Learning Engineering for Production", source: "PyTorch 官方资源索引", href: "https://pytorch.org/resources/", note: "继续关注模型发布、监控和生产边界。" }, { title: "cookiecutter-data-science", source: "开源项目", href: "https://github.com/drivendataorg/cookiecutter-data-science", note: "观察数据科学项目的目录和协作约定。" }],
  "python-project": [{ title: "TheAlgorithms/Python", source: "GitHub 开源项目", href: "https://github.com/TheAlgorithms/Python", note: "阅读小而完整的 Python 模块、测试和贡献规范。" }, { title: "Python Packaging User Guide", source: "Python Packaging User Guide", href: "https://packaging.python.org/en/latest/", note: "把 CLI 项目整理为可复现的 Python 包。" }],
};

export function getPythonResources(lessonId: string): LearningResource[] {
  return pythonResources[lessonId] ?? [pythonTutorial, runoobPython];
}
