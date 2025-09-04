import asyncio # 异步编程支持
import os # 操作系统功能
import json # 添加全局 json 模块导入
import traceback # 添加 traceback 模块导入，用于打印详细的错误信息

# agent: agent 是SDK的核心构建块，定义 agent 的行为、指令和可用工具
# Model: 抽象基类，定义模型的接口
# ModelProvider: 提供模型实例，自定义配置模型
# OpenAIChatCompletionsModel: OpenAI Chat Completions API的模型实现，用于与 OpenAI API 交互
# RunConfig: 用于配置 agent 运行的配置参数
# Runner: 用于运行 agent 的组件，负责管理 agent 的执行流程和上下文
# set_tracing_disabled: 用于禁用追踪
# ModelSettings: 配置模型的参数，如温度、top_p和工具选择策略等
from agents import (
    Agent,
    Model,
    ModelProvider,
    OpenAIChatCompletionsModel,
    RunConfig,
    Runner,
    set_tracing_disabled,
    ModelSettings
)
from openai import AsyncOpenAI # OpenAI异步客户端
# ResponseTextDeltaEvent: 表示文本增量响应事件，包含文本的增量变化
# ResponseContentPartDoneEvent: 表示内容部分完成响应事件，表示一个内容片段已完成生成
from openai.types.responses import ResponseTextDeltaEvent, ResponseContentPartDoneEvent

# MCP服务器相关，用于连接MCP服务器
from agents.mcp import MCPServerStdio

# 环境变量加载相关
from dotenv import load_dotenv

# 加载.env文件
load_dotenv()

# 设置DeepSeek API密钥
API_KEY = os.getenv("API_KEY")
# 设置DeepSeek API基础URL
BASE_URL = os.getenv("BASE_URL")
# 设置DeepSeek API模型名称
MODEL_NAME = os.getenv("MODEL_NAME")

if not API_KEY:
    raise ValueError("DeepSeek API密钥未设置")
if not BASE_URL:
    raise ValueError("DeepSeek API基础URL未设置")
if not MODEL_NAME:
    raise ValueError("DeepSeek API模型名称未设置")

# 创建 DeepSeek API 客户端(使用兼容openai的接口)
client = AsyncOpenAI(
    base_url=BASE_URL,
    api_key=API_KEY
)
# 禁用追踪以避免需要 Openai API 密钥
set_tracing_disabled(True)

class DeepSeekModelProvider(ModelProvider):
    """
    DeepSeek V3 模型提供商 - 通过 OpenAI兼容接口连接DeepSeek API
    这个类负责提供与 DeepSeek 模型的连接，通过 OpenAI 兼容接口调用 DeepSeek API
    """

    def get_model(self, model_name: str) -> Model:
        """
        获取模型实例，根据提供的模型名称创建并返回一个Openai兼容的模型实例

        Args:
            model_name (str): 模型名称，如果为空，则使用默认模型

        Returns:
            Model: OpenAI兼容的模型实例
        """
        # 使用 chat Completions API 调用 DeepSeek API,返回openai兼容模型
        return OpenAIChatCompletionsModel(model=model_name or MODEL_NAME, openai_client=client)

# 创建 DeepSeek 模型提供者实例
model_provider = DeepSeekModelProvider()

# 包含 MCP 服务连接和Agent创建运行
async def run_weather_agent(query: str, streaming: bool = True) -> None:
    """
    启动并运行天气agent，支持流式输出

    Args:
        query (str): 用户的自然语言查询
        streaming (bool): 是否流式输出
    """
    weather_server = None

    try:
        print("正在初始化DeepSeek-MCP天气查询agent...")
        # 创建 MCP 服务器连接实例，但不立即运行
        weather_server = MCPServerStdio(
            name="weather",
            params={
                "command": "C:\\Windows\\System32\\cmd.exe",
                "args": ["/c", "D:\\开源MCP项目\\weather\\weather_env\\Scripts\\python.exe", "D:\\开源MCP项目\\weather\\weather.py"],
                "env":{}
            },
            # 缓存工具列表以减少延迟，不需要每次连接时重新获取工具列表
            cache_tools_list=True
        )

        try:
            # 手动连接到MCP服务器
            print("正在连接到MCP服务器...")
            await weather_server.connect()
            print("MCP服务器连接成功！")

            # 等待服务器连接成功并获取MCP服务可用工具列表
            tools = await weather_server.list_tools()
            print("\n可用工具列表: ")
            for tool in tools:
                print(f" - {tool.name}: {tool.description}")

            # 创建agent实例
            weather_agent = Agent(
                name="天气助手",
                instructions=(
                    "你是一个专业、友好的天气助手，专门为用户提供准确、实用的天气信息和建议。\n\n"
                    
                    "## 核心能力\n"
                    "- 查询实时天气状况（温度、湿度、风速、能见度等）\n"
                    "- 提供多日天气预报和趋势分析\n"
                    "- 根据天气条件给出生活建议（穿衣、出行、户外活动等）\n"
                    "- 解释天气现象和气象术语\n\n"
                    
                    "## 工具使用原则\n"
                    "1. 智能识别用户查询意图，自动选择最合适的工具\n"
                    "2. 优先使用精确的地理位置信息进行查询\n"
                    "3. 如果用户提供的地点不明确，主动询问具体位置\n"
                    "4. 合理使用并行工具调用提高查询效率\n\n"
                    
                    "## 响应格式要求\n"
                    "- 提供结构化、易读的天气信息\n"
                    "- 使用适当的表情符号增强可读性（如🌤️☀️🌧️❄️）\n"
                    "- 包含关键数据：温度、湿度、风速、天气状况\n"
                    "- 提供实用的生活建议和注意事项\n"
                    "- 对于预报信息，突出重要变化和趋势\n\n"
                    
                    "## 交互指导\n"
                    "- 主动提供相关的补充信息\n"
                    "- 如果查询失败，提供替代方案或建议\n"
                    "- 对于模糊查询，给出澄清问题\n"
                    "- 保持回答简洁但信息完整\n\n"
                    
                    "始终以用户体验为中心，提供准确、及时、有用的天气服务。"
                ),
                # 指定 MCP 服务
                mcp_servers=[weather_server],
                # 配置模型参数
                model_settings=ModelSettings(
                    temperature=0.6, # 控制创造性/随机性
                    top_p=0.9, # 词汇多样性
                    max_tokens=4096, # 最大输出tokens,限制模型一次响应的最大长度
                    tool_choice="auto", # 自动选择工具
                    parallel_tool_calls=True, # 是否运行并行调用多个工具，如果为True，则可以并行调用多个工具,如果为False，则只能顺序调用工具
                    truncation="auto" # 截断策略：自动管理长文本
                )
            )

            print(f"\n正在处理查询：{query}\n")

            # 使用流式输出模式
            if streaming:
                # 在流式模式下调用大模型，异步运行并返回一个 RunResultStreaming 对象
                result = Runner.run_streamed(
                    weather_agent,
                    input=query,
                    max_turns=10, # 限制最大回合数
                    # agent 运行配置参数
                    run_config=RunConfig(
                        model_provider=model_provider, # 指定模型提供商
                        trace_include_sensitive_data=True, # 是否包含敏感数据
                        handoff_input_filter=None, # 可选的全局交接输入过滤器
                    )
                )

                print("回复:", end="", flush=True)
                try:
                    # 开始处理流式响应事件的循环
                    async for event in result.stream_events():
                      # 模型响应事件
                      if event.type == "raw_response_event":
                          # 情况1：处理文本增量事件 - 这是模型生成文本时逐个token的输出
                          if isinstance(event.data, ResponseTextDeltaEvent):
                              # 实时打印文本片段，不换行，并且立即刷新缓冲区
                              print(event.data.delta, end="", flush=True)
                          # 情况2：处理内容部分完成事件 - 当模型完成生成一个完整内容片段时触发
                          elif isinstance(event.data, ResponseContentPartDoneEvent):
                              print(f"\n", end="", flush=True)
                      # 处理运行项目流事件 - 如工具调用和调用结果
                      elif event.type == "run_item_stream_event":
                          # 情况1：处理工具调用事件 - 当工具被调用时触发
                          if event.item.type == "tool_call_item":
                              print(f"当前被调用工具信息: {event.item}")

                              # 从 raw_item 中提取要调用的工具名称和参数信息
                              raw_item = getattr(event.item, "raw_item", None)
                              tool_name = ""
                              tool_args = {}
                              if raw_item:
                                  # 获取工具名称
                                  tool_name = getattr(raw_item, "name", "未知工具")
                                  # 提取工具参数
                                  tool_str = getattr(raw_item, "arguments", "{}")
                                  # 如果 tool_args 是 JSON 字符串，就转换成 Python 对象
                                  if isinstance(tool_str, str):
                                      try:
                                          tool_args = json.loads(tool_str)
                                      except json.JSONDecodeError:
                                          tool_args = {"raw_arguments": tool_str}
                              print(f"\n工具名称: {tool_name}", flush=True)
                              print(f"\n工具参数: {tool_args}", flush=True)

                          # 情况2：处理工具调用输出事件 - 当工具调用完成并返回结果时触发
                          elif event.item.type == "tool_call_output_item":
                              # 提取工具调用结果信息
                              raw_item = getattr(event.item, "raw_item", None)
                              tool_id="未知工具ID"
                              # 获取工具调用ID作为标识符
                              if isinstance(raw_item, dict) and "call_id" in raw_item:
                                  tool_id = raw_item["call_id"]
                              # 获取工具返回的原始输出内容
                              output = getattr(event.item, "output", "未知输出")

                              output_text = ""
                              # 判断是否为 JSON 字符串
                              if isinstance(output, str) and (output.startswith("{") or output.startswith("[")):
                                  # 如果是JSON格式，解析为Python对象
                                  output_data = json.loads(output)
                                  # 根据常见的MCP工具响应格式提取有用的文本内容
                                  if isinstance(output_data, dict):
                                      if 'type' in output_data and output_data['type'] == 'text' and 'text' in output_data:
                                          output_text = output_data['text']
                                      elif 'text' in output_data:
                                          output_text = output_data['text']
                                      elif 'content' in output_data:
                                          output_text = output_data['content']
                                      else:
                                          output_text = json.dumps(output_data, ensure_ascii=False, indent=2)
                              else:
                                  # 如果不是JSON格式，直接使用原始字符串
                                  output_text = str(output)

                              print(f"\n工具调用{tool_id} 返回结果: {output_text}", flush=True)
                except Exception as e:
                    print(f"处理流式响应事件时发生错误: {e}", flush=True)
                    
                # 输出已完成
                print("\n\n天气查询完成！")

                # 显示完整的最终输出
                if hasattr(result, "final_output"):
                    print("\n===== 完整天气信息 =====")
                    print(result.final_output)
            else:
                print("使用非流式输出模式处理查询...")

                result = await Runner.run(
                    weather_agent,
                    input=query,
                    max_turns=10,
                    run_config=RunConfig(
                        model_provider=model_provider, # 指定模型提供商
                        trace_include_sensitive_data=True, # 是否包含敏感数据
                        handoff_input_filter=None, # 可选的全局交接输入过滤器
                    )
                )

                if hasattr(result, "final_output"):
                    print("\n===== 完整天气信息 =====")
                    print(result.final_output)
                else:
                    print("\n未获取到天气信息")
                
                # 如果有工具调用，显示工具调用历史
                if hasattr(result, "new_items"):
                    print("\n===== 工具调用历史 =====")
                    for item in result.new_items:
                        if item.type == "tool_call_item":
                            # 从 raw_item 中提取要调用的工具名称和参数信息
                            raw_item = getattr(item, "raw_item", None)
                            tool_name = ""
                            tool_args = {}
                            if raw_item:
                                # 获取工具名称
                                tool_name = getattr(raw_item, "name", "未知工具")
                                # 提取工具参数
                                tool_str = getattr(raw_item, "arguments", "{}")
                                # 如果 tool_str 是 JSON 字符串，就转换成 Python 对象
                                if isinstance(tool_str, str):
                                    try:
                                        tool_args = json.loads(tool_str)
                                    except json.JSONDecodeError:
                                        tool_args = {"raw_arguments": tool_str}
                            print(f"\n工具名称: {tool_name}")
                            print(f"\n工具参数: {tool_args}")
                        elif item.type == "tool_call_output_item":
                            # 提取工具调用结果信息
                            raw_item = getattr(item, "raw_item", None)
                            tool_id="未知工具ID"
                            # 获取工具调用ID作为标识符
                            if isinstance(raw_item, dict) and "call_id" in raw_item:
                                tool_id = raw_item["call_id"]
                            # 获取工具返回的原始输出内容
                            output = getattr(item, "output", "未知输出")

                            output_text = ""
                            # 判断是否为 JSON 字符串
                            if isinstance(output, str) and (output.startswith("{") or output.startswith("[")):
                                # 如果是JSON格式，解析为Python对象
                                output_data = json.loads(output)
                                # 根据常见的MCP工具响应格式提取有用的文本内容
                                if isinstance(output_data, dict):
                                    if 'type' in output_data and output_data['type'] == 'text' and 'text' in output_data:
                                        output_text = output_data['text']
                                    elif 'text' in output_data:
                                        output_text = output_data['text']
                                    elif 'content' in output_data:
                                        output_text = output_data['content']
                                    else:
                                        output_text = json.dumps(output_data, ensure_ascii=False, indent=2)
                            else:
                                # 如果不是JSON格式，直接使用原始字符串
                                output_text = str(output)

                            print(f"\n工具调用{tool_id} 返回结果: {output_text}")

        except Exception as e:
            print(f"连接MCP服务或执行查询时出错: {e}")
            traceback.print_exc()
            raise # 重新抛出异常，让外层try-finally能够捕获
            
    except Exception as e:
        print(f"运行天气Agent时出错: {e}")
        traceback.print_exc() # 打印详细的错误堆栈信息
    finally:
        # 无论是否发生异常，最后都关闭MCP服务器连接
        if weather_server:
            print("正在清理 MCP 服务器资源...")
            try:
                await weather_server.cleanup()
                print("MCP服务器资源清理成功！")
            except Exception as e:
                print(f"清理MCP服务器资源时出错: {e}")
                traceback.print_exc()
            
async def main():
    """
    应用程序主函数 - 循环交互模式

    这个函数实现了一个交互式循环，让用户输入自然语言查询天气相关信息
    """

    print("===== DeepSeek MCP 天气查询系统 =====")
    print("请输入自然语言查询，例如：")
    print(" - \"北京天气怎么样\"")
    print(" - \"查询上海未来5天天气预报\"")
    print("输入'quit'或'退出'结束程序")
    print("======================================\n")

    try:
        while True:
            # 获取用户输入
            user_query = input("\n请输入您的天气查询(输入'quit'或'退出'结束程序): ").strip()

            # 检查是否退出
            if user_query.lower() in ["quit", "退出"]:
                print("感谢使用DeepSeek MCP天气查询系统，再见！")
                break
            
            # 如果查询为空，则提示用户输入
            if not user_query:
                print("查询内容不能为空，请重新输入。")
                continue
            
            # 获取输出模型
            streaming = input("是否启用流式输出? (y/n, 默认y): ").strip().lower() != "n"

            # 运行天气查询agent，直接传入用户的自然语言和流式输出模式
            await run_weather_agent(user_query, streaming)

    except KeyboardInterrupt:
        print("\n程序被用户中断，正在退出...")
    except Exception as e:
        print(f"程序运行时发生错误: {e}")
        traceback.print_exc()
    finally:
        print("程序结束，所有资源已释放。")

# 程序入口点
if __name__ == "__main__":
    # 运行主函数
    asyncio.run(main())
        
    
    


